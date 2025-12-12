'use client'

/**
 * @fileoverview React hook for WebGL fluid simulation with full configuration control.
 */

import { useEffect, useRef, useCallback, useState } from 'react'
import type {
  GL,
  Color,
  SimConfig,
  WebGLExtensions,
  FBO,
  DoubleFBO,
  PointerData,
  UseFluidSimulationReturn,
} from '@/types'
import {
  baseVertexShader,
  blurVertexShader,
  blurShader,
  copyShader,
  clearShader,
  colorShader,
  checkerboardShader,
  bloomPrefilterShader,
  bloomBlurShader,
  bloomFinalShader,
  sunraysMaskShader,
  sunraysShader,
  splatShader,
  advectionShader,
  divergenceShader,
  curlShader,
  vorticityShader,
  pressureShader,
  gradientSubtractShader,
  displayShaderSource,
} from '@/lib/fluid-shaders'
import {
  GLProgram,
  Material,
  compileShader,
  getSupportedFormat,
  createFBO,
  createDoubleFBO,
  createDitheringTexture,
  blit,
  createPointer,
  scaleByPixelRatio,
  wrap,
  generateColor,
  normalizeColor,
  correctDeltaX,
  correctDeltaY,
  correctRadius,
  isMobile,
  getResolution,
  getTextureScale,
  resizeCanvas,
} from '@/lib/fluid-webgl'
import { parseCSSColor } from '@/lib/color-utils'

// ============================================================================
// Default Configuration
// ============================================================================

export const defaultConfig: SimConfig = {
  SIM_RESOLUTION: 128,
  DYE_RESOLUTION: 1024,
  CAPTURE_RESOLUTION: 512,
  DENSITY_DISSIPATION: 1.3,
  VELOCITY_DISSIPATION: 2.48,
  PRESSURE: 0.8,
  PRESSURE_ITERATIONS: 20,
  CURL: 60,
  SPLAT_RADIUS: 0.25,
  SPLAT_FORCE: 8000,
  SHADING: true,
  COLORFUL: true,
  COLOR_UPDATE_SPEED: 1,
  PAUSED: false,
  BACK_COLOR: { r: -100, g: 0, b: 0 },
  BACK_TRANSPARENT: false,
  TRANSPARENT: false,
  BLOOM: true,
  BLOOM_ITERATIONS: 8,
  BLOOM_RESOLUTION: 256,
  BLOOM_INTENSITY: 1.46,
  BLOOM_THRESHOLD: 0.6,
  BLOOM_SOFT_KNEE: 0.7,
  SUNRAYS: false,
  SUNRAYS_RESOLUTION: 196,
  SUNRAYS_WEIGHT: 0.4,
}

// ============================================================================
// Main Hook
// ============================================================================

export function useFluidSimulation(
  initialConfig: Partial<SimConfig> = {}
): UseFluidSimulationReturn {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const configRef = useRef<SimConfig>({ ...defaultConfig, ...initialConfig })
  const lastUpdateTimeRef = useRef<number>(Date.now())
  const colorUpdateTimeRef = useRef<number>(0)
  const splatStackRef = useRef<number[]>([])
  const colorPaletteIndexRef = useRef<number>(0)

  // State for triggering re-renders when config changes
  const [config, setConfigState] = useState<SimConfig>({ ...defaultConfig, ...initialConfig })

  // Refs for WebGL context and programs (persisted across renders)
  const glRef = useRef<GL | null>(null)
  const extRef = useRef<WebGLExtensions | null>(null)
  const programsRef = useRef<{
    blurProgram?: GLProgram
    copyProgram?: GLProgram
    clearProgram?: GLProgram
    colorProgram?: GLProgram
    checkerboardProgram?: GLProgram
    bloomPrefilterProgram?: GLProgram
    bloomBlurProgram?: GLProgram
    bloomFinalProgram?: GLProgram
    sunraysMaskProgram?: GLProgram
    sunraysProgram?: GLProgram
    splatProgram?: GLProgram
    advectionProgram?: GLProgram
    divergenceProgram?: GLProgram
    curlProgram?: GLProgram
    vorticityProgram?: GLProgram
    pressureProgram?: GLProgram
    gradientSubtractProgram?: GLProgram
    displayMaterial?: Material
  }>({})

  // Framebuffer refs
  const fbosRef = useRef<{
    dye?: DoubleFBO
    velocity?: DoubleFBO
    divergence?: FBO
    curl?: FBO
    pressure?: DoubleFBO
    bloom?: FBO
    bloomFramebuffers?: FBO[]
    sunrays?: FBO
    sunraysTemp?: FBO
    ditheringTexture?: { texture: WebGLTexture; width: number; height: number; attach: (id: number) => number }
  }>({})

  // Pointers ref
  const pointersRef = useRef<PointerData[]>([createPointer()])

  // Flags for reinitializing framebuffers
  const needsReinitRef = useRef<{
    framebuffers: boolean
    bloom: boolean
    sunrays: boolean
    keywords: boolean
  }>({ framebuffers: false, bloom: false, sunrays: false, keywords: false })

  // External splat function ref (to be called from outside)
  const externalSplatRef = useRef<((x: number, y: number, dx: number, dy: number, color?: Color) => void) | null>(null)
  const externalMultipleSplatsRef = useRef<((count: number) => void) | null>(null)

  // ============================================================================
  // Config Setters
  // ============================================================================

  const updateConfig = useCallback(<K extends keyof SimConfig>(key: K, value: SimConfig[K]) => {
    configRef.current[key] = value
    setConfigState(prev => ({ ...prev, [key]: value }))
  }, [])

  const setSimResolution = useCallback((value: number) => {
    updateConfig('SIM_RESOLUTION', value)
    needsReinitRef.current.framebuffers = true
  }, [updateConfig])

  const setDyeResolution = useCallback((value: number) => {
    updateConfig('DYE_RESOLUTION', value)
    needsReinitRef.current.framebuffers = true
  }, [updateConfig])

  const setDensityDissipation = useCallback((value: number) => {
    updateConfig('DENSITY_DISSIPATION', value)
  }, [updateConfig])

  const setVelocityDissipation = useCallback((value: number) => {
    updateConfig('VELOCITY_DISSIPATION', value)
  }, [updateConfig])

  const setPressure = useCallback((value: number) => {
    updateConfig('PRESSURE', value)
  }, [updateConfig])

  const setPressureIterations = useCallback((value: number) => {
    updateConfig('PRESSURE_ITERATIONS', value)
  }, [updateConfig])

  const setCurl = useCallback((value: number) => {
    updateConfig('CURL', value)
  }, [updateConfig])

  const setSplatRadius = useCallback((value: number) => {
    updateConfig('SPLAT_RADIUS', value)
  }, [updateConfig])

  const setSplatForce = useCallback((value: number) => {
    updateConfig('SPLAT_FORCE', value)
  }, [updateConfig])

  const setShading = useCallback((value: boolean) => {
    updateConfig('SHADING', value)
    needsReinitRef.current.keywords = true
  }, [updateConfig])

  const setColorful = useCallback((value: boolean) => {
    updateConfig('COLORFUL', value)
  }, [updateConfig])

  const setColorUpdateSpeed = useCallback((value: number) => {
    updateConfig('COLOR_UPDATE_SPEED', value)
  }, [updateConfig])

  const setBackColor = useCallback((value: Color) => {
    updateConfig('BACK_COLOR', value)
  }, [updateConfig])

  const setTransparent = useCallback((value: boolean) => {
    updateConfig('TRANSPARENT', value)
  }, [updateConfig])

  const setBloom = useCallback((value: boolean) => {
    updateConfig('BLOOM', value)
    needsReinitRef.current.keywords = true
    if (value) needsReinitRef.current.bloom = true
  }, [updateConfig])

  const setBloomIterations = useCallback((value: number) => {
    updateConfig('BLOOM_ITERATIONS', value)
    needsReinitRef.current.bloom = true
  }, [updateConfig])

  const setBloomResolution = useCallback((value: number) => {
    updateConfig('BLOOM_RESOLUTION', value)
    needsReinitRef.current.bloom = true
  }, [updateConfig])

  const setBloomIntensity = useCallback((value: number) => {
    updateConfig('BLOOM_INTENSITY', value)
  }, [updateConfig])

  const setBloomThreshold = useCallback((value: number) => {
    updateConfig('BLOOM_THRESHOLD', value)
  }, [updateConfig])

  const setBloomSoftKnee = useCallback((value: number) => {
    updateConfig('BLOOM_SOFT_KNEE', value)
  }, [updateConfig])

  const setSunrays = useCallback((value: boolean) => {
    updateConfig('SUNRAYS', value)
    needsReinitRef.current.keywords = true
    if (value) needsReinitRef.current.sunrays = true
  }, [updateConfig])

  const setSunraysResolution = useCallback((value: number) => {
    updateConfig('SUNRAYS_RESOLUTION', value)
    needsReinitRef.current.sunrays = true
  }, [updateConfig])

  const setSunraysWeight = useCallback((value: number) => {
    updateConfig('SUNRAYS_WEIGHT', value)
  }, [updateConfig])

  const setColorPalette = useCallback((colors: (Color | string)[] | undefined) => {
    updateConfig('COLOR_PALETTE', colors)
    colorPaletteIndexRef.current = 0 // Reset index when palette changes
  }, [updateConfig])

  // ============================================================================
  // Control Methods
  // ============================================================================

  const pause = useCallback(() => {
    configRef.current.PAUSED = true
    setConfigState(prev => ({ ...prev, PAUSED: true }))
  }, [])

  const resume = useCallback(() => {
    configRef.current.PAUSED = false
    setConfigState(prev => ({ ...prev, PAUSED: false }))
  }, [])

  const togglePause = useCallback(() => {
    const newValue = !configRef.current.PAUSED
    configRef.current.PAUSED = newValue
    setConfigState(prev => ({ ...prev, PAUSED: newValue }))
  }, [])

  const splat = useCallback((x: number, y: number, dx: number, dy: number, color?: Color) => {
    if (externalSplatRef.current) {
      externalSplatRef.current(x, y, dx, dy, color)
    }
  }, [])

  const multipleSplats = useCallback((count: number) => {
    if (externalMultipleSplatsRef.current) {
      externalMultipleSplatsRef.current(count)
    } else {
      splatStackRef.current.push(count)
    }
  }, [])

  // ============================================================================
  // Main Simulation Setup
  // ============================================================================

  const startSimulation = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    resizeCanvas(canvas)

    const params = {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
    }

    let gl: GL | null = canvas.getContext('webgl2', params) as WebGL2RenderingContext | null
    const isWebGL2 = !!gl
    if (!isWebGL2) {
      gl = (canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params)) as GL | null
    }

    if (!gl) {
      console.error('WebGL not supported')
      return
    }

    glRef.current = gl

    let halfFloat: number
    let supportLinearFiltering: OES_texture_float_linear | OES_texture_half_float_linear | null

    if (isWebGL2) {
      gl.getExtension('EXT_color_buffer_float')
      supportLinearFiltering = gl.getExtension('OES_texture_float_linear')
      halfFloat = (gl as WebGL2RenderingContext).HALF_FLOAT
    } else {
      const halfFloatExt = gl.getExtension('OES_texture_half_float')
      supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear')
      halfFloat = halfFloatExt ? halfFloatExt.HALF_FLOAT_OES : 0
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    const gl2 = gl as WebGL2RenderingContext

    let formatRGBA, formatRG, formatR
    if (isWebGL2) {
      formatRGBA = getSupportedFormat(gl, gl2.RGBA16F, gl.RGBA, halfFloat)
      formatRG = getSupportedFormat(gl, gl2.RG16F, gl2.RG, halfFloat)
      formatR = getSupportedFormat(gl, gl2.R16F, gl2.RED, halfFloat)
    } else {
      formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloat)
      formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloat)
      formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloat)
    }

    const ext: WebGLExtensions = {
      formatRGBA,
      formatRG,
      formatR,
      halfFloatTexType: halfFloat,
      supportLinearFiltering,
    }
    extRef.current = ext

    if (isMobile()) {
      configRef.current.DYE_RESOLUTION = 512
    }
    if (!ext.supportLinearFiltering) {
      configRef.current.DYE_RESOLUTION = 512
      configRef.current.SHADING = false
      configRef.current.BLOOM = false
      configRef.current.SUNRAYS = false
    }

    // Compile shaders
    const baseVertexShaderCompiled = compileShader(gl, gl.VERTEX_SHADER, baseVertexShader)
    const blurVertexShaderCompiled = compileShader(gl, gl.VERTEX_SHADER, blurVertexShader)

    const programs = programsRef.current
    programs.blurProgram = new GLProgram(gl, blurVertexShaderCompiled, compileShader(gl, gl.FRAGMENT_SHADER, blurShader))
    programs.copyProgram = new GLProgram(gl, baseVertexShaderCompiled, compileShader(gl, gl.FRAGMENT_SHADER, copyShader))
    programs.clearProgram = new GLProgram(gl, baseVertexShaderCompiled, compileShader(gl, gl.FRAGMENT_SHADER, clearShader))
    programs.colorProgram = new GLProgram(gl, baseVertexShaderCompiled, compileShader(gl, gl.FRAGMENT_SHADER, colorShader))
    programs.checkerboardProgram = new GLProgram(gl, baseVertexShaderCompiled, compileShader(gl, gl.FRAGMENT_SHADER, checkerboardShader))
    programs.bloomPrefilterProgram = new GLProgram(gl, baseVertexShaderCompiled, compileShader(gl, gl.FRAGMENT_SHADER, bloomPrefilterShader))
    programs.bloomBlurProgram = new GLProgram(gl, baseVertexShaderCompiled, compileShader(gl, gl.FRAGMENT_SHADER, bloomBlurShader))
    programs.bloomFinalProgram = new GLProgram(gl, baseVertexShaderCompiled, compileShader(gl, gl.FRAGMENT_SHADER, bloomFinalShader))
    programs.sunraysMaskProgram = new GLProgram(gl, baseVertexShaderCompiled, compileShader(gl, gl.FRAGMENT_SHADER, sunraysMaskShader))
    programs.sunraysProgram = new GLProgram(gl, baseVertexShaderCompiled, compileShader(gl, gl.FRAGMENT_SHADER, sunraysShader))
    programs.splatProgram = new GLProgram(gl, baseVertexShaderCompiled, compileShader(gl, gl.FRAGMENT_SHADER, splatShader))
    programs.advectionProgram = new GLProgram(
      gl,
      baseVertexShaderCompiled,
      compileShader(gl, gl.FRAGMENT_SHADER, advectionShader, ext.supportLinearFiltering ? undefined : ['MANUAL_FILTERING'])
    )
    programs.divergenceProgram = new GLProgram(gl, baseVertexShaderCompiled, compileShader(gl, gl.FRAGMENT_SHADER, divergenceShader))
    programs.curlProgram = new GLProgram(gl, baseVertexShaderCompiled, compileShader(gl, gl.FRAGMENT_SHADER, curlShader))
    programs.vorticityProgram = new GLProgram(gl, baseVertexShaderCompiled, compileShader(gl, gl.FRAGMENT_SHADER, vorticityShader))
    programs.pressureProgram = new GLProgram(gl, baseVertexShaderCompiled, compileShader(gl, gl.FRAGMENT_SHADER, pressureShader))
    programs.gradientSubtractProgram = new GLProgram(gl, baseVertexShaderCompiled, compileShader(gl, gl.FRAGMENT_SHADER, gradientSubtractShader))
    programs.displayMaterial = new Material(gl, baseVertexShaderCompiled, displayShaderSource)

    // Setup vertex buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(0)

    // Initialize
    fbosRef.current.ditheringTexture = createDitheringTexture(gl)
    fbosRef.current.bloomFramebuffers = []

    const pointers = pointersRef.current

    // ============================================================================
    // Internal Functions
    // ============================================================================

    function initFramebuffers() {
      const simRes = getResolution(gl!, configRef.current.SIM_RESOLUTION)
      const dyeRes = getResolution(gl!, configRef.current.DYE_RESOLUTION)

      const texType = ext.halfFloatTexType
      const rgba = ext.formatRGBA!
      const rg = ext.formatRG!
      const r = ext.formatR!
      const filtering = ext.supportLinearFiltering ? gl!.LINEAR : gl!.NEAREST

      gl!.disable(gl!.BLEND)

      fbosRef.current.dye = createDoubleFBO(gl!, dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering)
      fbosRef.current.velocity = createDoubleFBO(gl!, simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering)
      fbosRef.current.divergence = createFBO(gl!, simRes.width, simRes.height, r.internalFormat, r.format, texType, gl!.NEAREST)
      fbosRef.current.curl = createFBO(gl!, simRes.width, simRes.height, r.internalFormat, r.format, texType, gl!.NEAREST)
      fbosRef.current.pressure = createDoubleFBO(gl!, simRes.width, simRes.height, r.internalFormat, r.format, texType, gl!.NEAREST)

      initBloomFramebuffers()
      initSunraysFramebuffers()
    }

    function initBloomFramebuffers() {
      const res = getResolution(gl!, configRef.current.BLOOM_RESOLUTION)
      const texType = ext.halfFloatTexType
      const rgba = ext.formatRGBA!
      const filtering = ext.supportLinearFiltering ? gl!.LINEAR : gl!.NEAREST

      fbosRef.current.bloom = createFBO(gl!, res.width, res.height, rgba.internalFormat, rgba.format, texType, filtering)
      fbosRef.current.bloomFramebuffers = []

      for (let i = 0; i < configRef.current.BLOOM_ITERATIONS; i++) {
        const width = res.width >> (i + 1)
        const height = res.height >> (i + 1)
        if (width < 2 || height < 2) break
        fbosRef.current.bloomFramebuffers.push(createFBO(gl!, width, height, rgba.internalFormat, rgba.format, texType, filtering))
      }
    }

    function initSunraysFramebuffers() {
      const res = getResolution(gl!, configRef.current.SUNRAYS_RESOLUTION)
      const texType = ext.halfFloatTexType
      const r = ext.formatR!
      const filtering = ext.supportLinearFiltering ? gl!.LINEAR : gl!.NEAREST

      fbosRef.current.sunrays = createFBO(gl!, res.width, res.height, r.internalFormat, r.format, texType, filtering)
      fbosRef.current.sunraysTemp = createFBO(gl!, res.width, res.height, r.internalFormat, r.format, texType, filtering)
    }

    function updateKeywords() {
      const displayKeywords: string[] = []
      if (configRef.current.SHADING) displayKeywords.push('SHADING')
      if (configRef.current.BLOOM) displayKeywords.push('BLOOM')
      if (configRef.current.SUNRAYS) displayKeywords.push('SUNRAYS')
      programs.displayMaterial!.setKeywords(displayKeywords)
    }

    function updatePointerDownData(pointer: PointerData, id: number, posX: number, posY: number) {
      pointer.id = id
      pointer.down = true
      pointer.moved = false
      pointer.texcoordX = posX / canvas!.width
      pointer.texcoordY = 1.0 - posY / canvas!.height
      pointer.prevTexcoordX = pointer.texcoordX
      pointer.prevTexcoordY = pointer.texcoordY
      pointer.deltaX = 0
      pointer.deltaY = 0
      pointer.color = getNextColor()
    }

    function updatePointerMoveData(pointer: PointerData, posX: number, posY: number) {
      pointer.prevTexcoordX = pointer.texcoordX
      pointer.prevTexcoordY = pointer.texcoordY
      pointer.texcoordX = posX / canvas!.width
      pointer.texcoordY = 1.0 - posY / canvas!.height
      const aspectRatio = canvas!.width / canvas!.height
      pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX, aspectRatio)
      pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY, aspectRatio)
      pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0
    }

    function updatePointerUpData(pointer: PointerData) {
      pointer.down = false
    }

    // Event handlers
    const handleClick = (e: MouseEvent) => {
      const posX = scaleByPixelRatio(e.offsetX)
      const posY = scaleByPixelRatio(e.offsetY)
      let pointer = pointers.find((p) => p.id === -1)
      if (pointer == null) pointer = createPointer()
      updatePointerDownData(pointer, -1, posX, posY)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const pointer = pointers[0]
      if (!pointer.down) return
      const posX = scaleByPixelRatio(e.pageX)
      const posY = scaleByPixelRatio(e.pageY)
      updatePointerMoveData(pointer, posX, posY)
    }

    const handleMouseUp = () => {
      updatePointerUpData(pointers[0])
    }

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      const touches = e.targetTouches
      while (touches.length >= pointers.length) {
        pointers.push(createPointer())
      }
      for (let i = 0; i < touches.length; i++) {
        const posX = scaleByPixelRatio(touches[i].pageX)
        const posY = scaleByPixelRatio(touches[i].pageY)
        updatePointerDownData(pointers[i + 1], touches[i].identifier, posX, posY)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const touches = e.targetTouches
      for (let i = 0; i < touches.length; i++) {
        const pointer = pointers[i + 1]
        if (!pointer.down) continue
        const posX = scaleByPixelRatio(touches[i].pageX)
        const posY = scaleByPixelRatio(touches[i].pageY)
        updatePointerMoveData(pointer, posX, posY)
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touches = e.changedTouches
      for (let i = 0; i < touches.length; i++) {
        const pointer = pointers.find((p) => p.id === touches[i].identifier)
        if (pointer == null) continue
        updatePointerUpData(pointer)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyP') {
        togglePause()
      }
      if (e.key === ' ') {
        splatStackRef.current.push(Math.floor(Math.random() * 20) + 5)
      }
    }

    // Splat functions
    function internalSplat(x: number, y: number, dx: number, dy: number, color: Color) {
      const { splatProgram } = programs
      const { dye, velocity } = fbosRef.current
      if (!splatProgram || !dye || !velocity) return

      splatProgram.bind(gl!)
      gl!.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0))
      gl!.uniform1f(splatProgram.uniforms.aspectRatio, canvas!.width / canvas!.height)
      gl!.uniform2f(splatProgram.uniforms.point, x, y)
      gl!.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0)
      gl!.uniform1f(splatProgram.uniforms.radius, correctRadius(configRef.current.SPLAT_RADIUS / 100.0, canvas!.width / canvas!.height))
      blit(gl!, velocity.write)
      velocity.swap()

      gl!.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0))
      gl!.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b)
      blit(gl!, dye.write)
      dye.swap()
    }

    // Helper function to get next color from palette or generate random
    function getNextColor(): Color {
      const palette = configRef.current.COLOR_PALETTE
      if (palette && palette.length > 0) {
        const paletteItem = palette[colorPaletteIndexRef.current % palette.length]
        colorPaletteIndexRef.current = (colorPaletteIndexRef.current + 1) % palette.length

        // Parse the color - handle both Color objects and CSS strings
        let color: Color
        if (typeof paletteItem === 'string') {
          const parsed = parseCSSColor(paletteItem)
          if (!parsed) {
            // Fall back to random if parsing fails
            return generateColor()
          }
          color = parsed
        } else {
          color = paletteItem
        }

        // Return a copy with the same 0.15 multiplier as generateColor
        return {
          r: color.r * 0.15,
          g: color.g * 0.15,
          b: color.b * 0.15,
        }
      }
      return generateColor()
    }

    function splatPointer(pointer: PointerData) {
      const dx = pointer.deltaX * configRef.current.SPLAT_FORCE
      const dy = pointer.deltaY * configRef.current.SPLAT_FORCE
      internalSplat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color)
    }

    function internalMultipleSplats(amount: number) {
      for (let i = 0; i < amount; i++) {
        const color = getNextColor()
        color.r *= 10.0
        color.g *= 10.0
        color.b *= 10.0
        const x = Math.random()
        const y = Math.random()
        const dx = (Math.random() - 0.5) * 1000
        const dy = (Math.random() - 0.5) * 1000
        internalSplat(x, y, dx, dy, color)
      }
    }

    // Expose splat functions externally
    externalSplatRef.current = (x: number, y: number, dx: number, dy: number, color?: Color) => {
      const c = color || generateColor()
      internalSplat(x, y, dx * configRef.current.SPLAT_FORCE, dy * configRef.current.SPLAT_FORCE, c)
    }
    externalMultipleSplatsRef.current = internalMultipleSplats

    // Step function
    function step(dt: number) {
      const { velocity, dye, divergence, curl, pressure } = fbosRef.current
      const { curlProgram, vorticityProgram, divergenceProgram, clearProgram, pressureProgram, gradientSubtractProgram, advectionProgram } = programs

      if (!velocity || !dye || !divergence || !curl || !pressure) return
      if (!curlProgram || !vorticityProgram || !divergenceProgram || !clearProgram || !pressureProgram || !gradientSubtractProgram || !advectionProgram) return

      gl!.disable(gl!.BLEND)

      curlProgram.bind(gl!)
      gl!.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY)
      gl!.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0))
      blit(gl!, curl)

      vorticityProgram.bind(gl!)
      gl!.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY)
      gl!.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0))
      gl!.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1))
      gl!.uniform1f(vorticityProgram.uniforms.curl, configRef.current.CURL)
      gl!.uniform1f(vorticityProgram.uniforms.dt, dt)
      blit(gl!, velocity.write)
      velocity.swap()

      divergenceProgram.bind(gl!)
      gl!.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY)
      gl!.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0))
      blit(gl!, divergence)

      clearProgram.bind(gl!)
      gl!.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0))
      gl!.uniform1f(clearProgram.uniforms.value, configRef.current.PRESSURE)
      blit(gl!, pressure.write)
      pressure.swap()

      pressureProgram.bind(gl!)
      gl!.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY)
      gl!.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0))
      for (let i = 0; i < configRef.current.PRESSURE_ITERATIONS; i++) {
        gl!.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1))
        blit(gl!, pressure.write)
        pressure.swap()
      }

      gradientSubtractProgram.bind(gl!)
      gl!.uniform2f(gradientSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY)
      gl!.uniform1i(gradientSubtractProgram.uniforms.uPressure, pressure.read.attach(0))
      gl!.uniform1i(gradientSubtractProgram.uniforms.uVelocity, velocity.read.attach(1))
      blit(gl!, velocity.write)
      velocity.swap()

      advectionProgram.bind(gl!)
      gl!.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY)
      if (!ext.supportLinearFiltering) {
        gl!.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY)
      }
      const velocityId = velocity.read.attach(0)
      gl!.uniform1i(advectionProgram.uniforms.uVelocity, velocityId)
      gl!.uniform1i(advectionProgram.uniforms.uSource, velocityId)
      gl!.uniform1f(advectionProgram.uniforms.dt, dt)
      gl!.uniform1f(advectionProgram.uniforms.dissipation, configRef.current.VELOCITY_DISSIPATION)
      blit(gl!, velocity.write)
      velocity.swap()

      if (!ext.supportLinearFiltering) {
        gl!.uniform2f(advectionProgram.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY)
      }
      gl!.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0))
      gl!.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1))
      gl!.uniform1f(advectionProgram.uniforms.dissipation, configRef.current.DENSITY_DISSIPATION)
      blit(gl!, dye.write)
      dye.swap()
    }

    function render(target: FBO | null) {
      const { dye, bloom, bloomFramebuffers, sunrays, sunraysTemp, ditheringTexture } = fbosRef.current
      const { colorProgram, checkerboardProgram, displayMaterial, bloomPrefilterProgram, bloomBlurProgram, bloomFinalProgram, sunraysMaskProgram, sunraysProgram, blurProgram } = programs

      if (!dye || !displayMaterial) return

      if (configRef.current.BLOOM && bloom && bloomFramebuffers && bloomFramebuffers.length >= 2) {
        applyBloom(dye.read, bloom, bloomFramebuffers)
      }

      if (configRef.current.SUNRAYS && sunrays && sunraysTemp) {
        applySunrays(dye.read, dye.write, sunrays, sunraysTemp)
      }

      if (target == null || configRef.current.TRANSPARENT) {
        gl!.blendFunc(gl!.ONE, gl!.ONE_MINUS_SRC_ALPHA)
        gl!.enable(gl!.BLEND)
      } else {
        gl!.disable(gl!.BLEND)
      }

      if (!configRef.current.TRANSPARENT && colorProgram) {
        const color = normalizeColor(configRef.current.BACK_COLOR)
        if (!configRef.current.BACK_TRANSPARENT) {
          colorProgram.bind(gl!)
          gl!.uniform4f(colorProgram.uniforms.color, color.r, color.g, color.b, 1)
        }
        blit(gl!, target)
      }

      if (target == null && configRef.current.TRANSPARENT && checkerboardProgram) {
        checkerboardProgram.bind(gl!)
        gl!.uniform1f(checkerboardProgram.uniforms.aspectRatio, canvas!.width / canvas!.height)
        blit(gl!, target)
      }

      // Draw display
      const width = target == null ? gl!.drawingBufferWidth : target.width
      const height = target == null ? gl!.drawingBufferHeight : target.height

      displayMaterial.bind()
      if (configRef.current.SHADING) {
        gl!.uniform2f(displayMaterial.uniforms.texelSize, 1.0 / width, 1.0 / height)
      }
      gl!.uniform1i(displayMaterial.uniforms.uTexture, dye.read.attach(0))
      if (configRef.current.BLOOM && bloom) {
        gl!.uniform1i(displayMaterial.uniforms.uBloom, bloom.attach(1))
        if (ditheringTexture) {
          gl!.uniform1i(displayMaterial.uniforms.uDithering, ditheringTexture.attach(2))
          const ditherScale = getTextureScale(ditheringTexture, width, height)
          gl!.uniform2f(displayMaterial.uniforms.ditherScale, ditherScale.x, ditherScale.y)
        }
      }
      if (configRef.current.SUNRAYS && sunrays) {
        gl!.uniform1i(displayMaterial.uniforms.uSunrays, sunrays.attach(3))
      }
      blit(gl!, target)

      function applyBloom(source: FBO, destination: FBO, bloomFBOs: FBO[]) {
        if (!bloomPrefilterProgram || !bloomBlurProgram || !bloomFinalProgram) return

        let last = destination

        gl!.disable(gl!.BLEND)
        bloomPrefilterProgram.bind(gl!)
        const knee = configRef.current.BLOOM_THRESHOLD * configRef.current.BLOOM_SOFT_KNEE + 0.0001
        const curve0 = configRef.current.BLOOM_THRESHOLD - knee
        const curve1 = knee * 2
        const curve2 = 0.25 / knee
        gl!.uniform3f(bloomPrefilterProgram.uniforms.curve, curve0, curve1, curve2)
        gl!.uniform1f(bloomPrefilterProgram.uniforms.threshold, configRef.current.BLOOM_THRESHOLD)
        gl!.uniform1i(bloomPrefilterProgram.uniforms.uTexture, source.attach(0))
        blit(gl!, last)

        bloomBlurProgram.bind(gl!)
        for (let i = 0; i < bloomFBOs.length; i++) {
          const dest = bloomFBOs[i]
          gl!.uniform2f(bloomBlurProgram.uniforms.texelSize, last.texelSizeX, last.texelSizeY)
          gl!.uniform1i(bloomBlurProgram.uniforms.uTexture, last.attach(0))
          blit(gl!, dest)
          last = dest
        }

        gl!.blendFunc(gl!.ONE, gl!.ONE)
        gl!.enable(gl!.BLEND)

        for (let i = bloomFBOs.length - 2; i >= 0; i--) {
          const baseTex = bloomFBOs[i]
          gl!.uniform2f(bloomBlurProgram.uniforms.texelSize, last.texelSizeX, last.texelSizeY)
          gl!.uniform1i(bloomBlurProgram.uniforms.uTexture, last.attach(0))
          gl!.viewport(0, 0, baseTex.width, baseTex.height)
          blit(gl!, baseTex)
          last = baseTex
        }

        gl!.disable(gl!.BLEND)
        bloomFinalProgram.bind(gl!)
        gl!.uniform2f(bloomFinalProgram.uniforms.texelSize, last.texelSizeX, last.texelSizeY)
        gl!.uniform1i(bloomFinalProgram.uniforms.uTexture, last.attach(0))
        gl!.uniform1f(bloomFinalProgram.uniforms.intensity, configRef.current.BLOOM_INTENSITY)
        blit(gl!, destination)
      }

      function applySunrays(source: FBO, mask: FBO, destination: FBO, temp: FBO) {
        if (!sunraysMaskProgram || !sunraysProgram || !blurProgram) return

        gl!.disable(gl!.BLEND)
        sunraysMaskProgram.bind(gl!)
        gl!.uniform1i(sunraysMaskProgram.uniforms.uTexture, source.attach(0))
        blit(gl!, mask)

        sunraysProgram.bind(gl!)
        gl!.uniform1f(sunraysProgram.uniforms.weight, configRef.current.SUNRAYS_WEIGHT)
        gl!.uniform1i(sunraysProgram.uniforms.uTexture, mask.attach(0))
        blit(gl!, destination)

        // Blur
        blurProgram.bind(gl!)
        gl!.uniform2f(blurProgram.uniforms.texelSize, destination.texelSizeX, 0.0)
        gl!.uniform1i(blurProgram.uniforms.uTexture, destination.attach(0))
        blit(gl!, temp)

        gl!.uniform2f(blurProgram.uniforms.texelSize, 0.0, destination.texelSizeY)
        gl!.uniform1i(blurProgram.uniforms.uTexture, temp.attach(0))
        blit(gl!, destination)
      }
    }

    // Animation loop
    function update() {
      const dt = calcDeltaTime()

      // Handle reinit flags
      if (needsReinitRef.current.framebuffers) {
        initFramebuffers()
        needsReinitRef.current.framebuffers = false
      }
      if (needsReinitRef.current.bloom) {
        initBloomFramebuffers()
        needsReinitRef.current.bloom = false
      }
      if (needsReinitRef.current.sunrays) {
        initSunraysFramebuffers()
        needsReinitRef.current.sunrays = false
      }
      if (needsReinitRef.current.keywords) {
        updateKeywords()
        needsReinitRef.current.keywords = false
      }

      if (resizeCanvas(canvas!)) {
        initFramebuffers()
      }

      updateColors(dt)
      applyInputs()

      if (!configRef.current.PAUSED) {
        step(dt)
      }

      render(null)
      animationRef.current = requestAnimationFrame(update)
    }

    function calcDeltaTime(): number {
      const now = Date.now()
      let dt = (now - lastUpdateTimeRef.current) / 1000
      dt = Math.min(dt, 0.016666)
      lastUpdateTimeRef.current = now
      return dt
    }

    function updateColors(dt: number) {
      if (!configRef.current.COLORFUL) return

      colorUpdateTimeRef.current += dt * configRef.current.COLOR_UPDATE_SPEED
      if (colorUpdateTimeRef.current >= 1) {
        colorUpdateTimeRef.current = wrap(colorUpdateTimeRef.current, 0, 1)
        pointers.forEach((p) => {
          p.color = getNextColor()
        })
      }
    }

    function applyInputs() {
      if (splatStackRef.current.length > 0) {
        internalMultipleSplats(splatStackRef.current.pop()!)
      }

      pointers.forEach((p) => {
        if (p.moved) {
          p.moved = false
          splatPointer(p)
        }
      })
    }

    // Setup event listeners
    canvas.addEventListener('click', handleClick)
    canvas.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false })
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd)
    window.addEventListener('keydown', handleKeyDown)

    // Initialize
    updateKeywords()
    initFramebuffers()
    internalMultipleSplats(Math.floor(Math.random() * 20) + 5)

    // Start animation
    animationRef.current = requestAnimationFrame(update)

    // Cleanup
    return () => {
      cancelAnimationFrame(animationRef.current)
      canvas.removeEventListener('click', handleClick)
      canvas.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [togglePause])

  useEffect(() => {
    const cleanup = startSimulation()
    return cleanup
  }, [startSimulation])

  return {
    canvasRef,
    config,
    pause,
    resume,
    togglePause,
    splat,
    multipleSplats,
    setSimResolution,
    setDyeResolution,
    setDensityDissipation,
    setVelocityDissipation,
    setPressure,
    setPressureIterations,
    setCurl,
    setSplatRadius,
    setSplatForce,
    setShading,
    setColorful,
    setColorUpdateSpeed,
    setBackColor,
    setTransparent,
    setBloom,
    setBloomIterations,
    setBloomResolution,
    setBloomIntensity,
    setBloomThreshold,
    setBloomSoftKnee,
    setSunrays,
    setSunraysResolution,
    setSunraysWeight,
    setColorPalette,
  }
}
