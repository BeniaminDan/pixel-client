/**
 * @fileoverview WebGL utility classes and helper functions for the fluid simulation.
 */

import type { GL, Color, TextureFormat, PointerData, FBO, DoubleFBO, DitheringTexture } from '@/types'

// ============================================================================
// WebGL Program Classes
// ============================================================================

export class GLProgram {
  program: WebGLProgram
  uniforms: Record<string, WebGLUniformLocation>

  constructor(gl: GL, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    this.uniforms = {}
    this.program = gl.createProgram()!
    gl.attachShader(this.program, vertexShader)
    gl.attachShader(this.program, fragmentShader)
    gl.linkProgram(this.program)

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.trace(gl.getProgramInfoLog(this.program))
    }

    const uniformCount = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS)
    for (let i = 0; i < uniformCount; i++) {
      const uniformName = gl.getActiveUniform(this.program, i)!.name
      this.uniforms[uniformName] = gl.getUniformLocation(this.program, uniformName)!
    }
  }

  bind(gl: GL) {
    gl.useProgram(this.program)
  }
}

export class Material {
  vertexShader: WebGLShader
  fragmentShaderSource: string
  programs: GLProgram[]
  activeProgram: GLProgram | null
  uniforms: Record<string, WebGLUniformLocation>
  gl: GL

  constructor(gl: GL, vertexShader: WebGLShader, fragmentShaderSource: string) {
    this.gl = gl
    this.vertexShader = vertexShader
    this.fragmentShaderSource = fragmentShaderSource
    this.programs = []
    this.activeProgram = null
    this.uniforms = {}
  }

  setKeywords(keywords: string[]) {
    let hash = 0
    for (let i = 0; i < keywords.length; i++) {
      hash += hashCode(keywords[i])
    }

    let program = this.programs[hash]
    if (program == null) {
      const fragmentShader = compileShader(
        this.gl,
        this.gl.FRAGMENT_SHADER,
        this.fragmentShaderSource,
        keywords
      )
      program = new GLProgram(this.gl, this.vertexShader, fragmentShader)
      this.programs[hash] = program
    }

    if (program !== this.activeProgram) {
      this.uniforms = program.uniforms
      this.activeProgram = program
    }
  }

  bind() {
    if (this.activeProgram) {
      this.gl.useProgram(this.activeProgram.program)
    }
  }
}

// ============================================================================
// Shader Compilation
// ============================================================================

export function compileShader(
  gl: GL,
  type: number,
  source: string,
  keywords?: string[]
): WebGLShader {
  source = addKeywords(source, keywords)
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.trace(gl.getShaderInfoLog(shader))
  }

  return shader
}

export function addKeywords(source: string, keywords?: string[]): string {
  if (keywords == null) return source
  let keywordsString = ''
  keywords.forEach((keyword) => {
    keywordsString += '#define ' + keyword + '\n'
  })
  return keywordsString + source
}

// ============================================================================
// Texture Format Support
// ============================================================================

export function getSupportedFormat(
  gl: GL,
  internalFormat: number,
  format: number,
  type: number
): TextureFormat | null {
  if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
    const gl2 = gl as WebGL2RenderingContext
    switch (internalFormat) {
      case gl2.R16F:
        return getSupportedFormat(gl, gl2.RG16F, gl2.RG, type)
      case gl2.RG16F:
        return getSupportedFormat(gl, gl2.RGBA16F, gl.RGBA, type)
      default:
        return null
    }
  }
  return { internalFormat, format }
}

export function supportRenderTextureFormat(
  gl: GL,
  internalFormat: number,
  format: number,
  type: number
): boolean {
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null)

  const fbo = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)

  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER)
  return status === gl.FRAMEBUFFER_COMPLETE
}

// ============================================================================
// Framebuffer Operations
// ============================================================================

export function createFBO(
  gl: GL,
  w: number,
  h: number,
  internalFormat: number,
  format: number,
  type: number,
  param: number
): FBO {
  gl.activeTexture(gl.TEXTURE0)
  const texture = gl.createTexture()!
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null)

  const fbo = gl.createFramebuffer()!
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
  gl.viewport(0, 0, w, h)
  gl.clear(gl.COLOR_BUFFER_BIT)

  const texelSizeX = 1.0 / w
  const texelSizeY = 1.0 / h

  return {
    texture,
    fbo,
    width: w,
    height: h,
    texelSizeX,
    texelSizeY,
    attach(id: number) {
      gl.activeTexture(gl.TEXTURE0 + id)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      return id
    },
  }
}

export function createDoubleFBO(
  gl: GL,
  w: number,
  h: number,
  internalFormat: number,
  format: number,
  type: number,
  param: number
): DoubleFBO {
  let fbo1 = createFBO(gl, w, h, internalFormat, format, type, param)
  let fbo2 = createFBO(gl, w, h, internalFormat, format, type, param)

  return {
    width: w,
    height: h,
    texelSizeX: fbo1.texelSizeX,
    texelSizeY: fbo1.texelSizeY,
    get read() { return fbo1 },
    set read(value) { fbo1 = value },
    get write() { return fbo2 },
    set write(value) { fbo2 = value },
    swap() {
      const temp = fbo1
      fbo1 = fbo2
      fbo2 = temp
    },
  }
}

export function resizeFBO(
  gl: GL,
  target: FBO,
  w: number,
  h: number,
  internalFormat: number,
  format: number,
  type: number,
  param: number,
  copyProgram: GLProgram,
  blit: (gl: GL, target: FBO | null, clear?: boolean) => void
): FBO {
  const newFBO = createFBO(gl, w, h, internalFormat, format, type, param)
  copyProgram.bind(gl)
  gl.uniform1i(copyProgram.uniforms.uTexture, target.attach(0))
  blit(gl, newFBO)
  return newFBO
}

export function resizeDoubleFBO(
  gl: GL,
  target: DoubleFBO,
  w: number,
  h: number,
  internalFormat: number,
  format: number,
  type: number,
  param: number,
  copyProgram: GLProgram,
  blit: (gl: GL, target: FBO | null, clear?: boolean) => void
): DoubleFBO {
  if (target.width === w && target.height === h) return target

  target.read = resizeFBO(gl, target.read, w, h, internalFormat, format, type, param, copyProgram, blit)
  target.write = createFBO(gl, w, h, internalFormat, format, type, param)
  target.width = w
  target.height = h
  target.texelSizeX = 1.0 / w
  target.texelSizeY = 1.0 / h
  return target
}

export function createDitheringTexture(gl: GL): DitheringTexture {
  const texture = gl.createTexture()!
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGB,
    1,
    1,
    0,
    gl.RGB,
    gl.UNSIGNED_BYTE,
    new Uint8Array([255, 255, 255])
  )

  return {
    texture,
    width: 1,
    height: 1,
    attach(id: number) {
      gl.activeTexture(gl.TEXTURE0 + id)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      return id
    },
  }
}

export function blit(gl: GL, target: FBO | null, clear = false) {
  if (target == null) {
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  } else {
    gl.viewport(0, 0, target.width, target.height)
    gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo)
  }
  if (clear) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
  }
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
}

// ============================================================================
// Pointer / Input Helpers
// ============================================================================

export function createPointer(): PointerData {
  return {
    id: -1,
    texcoordX: 0,
    texcoordY: 0,
    prevTexcoordX: 0,
    prevTexcoordY: 0,
    deltaX: 0,
    deltaY: 0,
    down: false,
    moved: false,
    color: { r: 0, g: 0, b: 0 },
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

export function hashCode(s: string): number {
  if (s.length === 0) return 0
  let hash = 0
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash) + s.charCodeAt(i)
    hash |= 0
  }
  return hash
}

export function scaleByPixelRatio(input: number): number {
  const pixelRatio = window.devicePixelRatio || 1
  return Math.floor(input * pixelRatio)
}

export function wrap(value: number, min: number, max: number): number {
  const range = max - min
  if (range === 0) return min
  return ((value - min) % range) + min
}

// ============================================================================
// Color Functions
// ============================================================================

export function HSVtoRGB(h: number, s: number, v: number): Color {
  let r = 0, g = 0, b = 0
  const i = Math.floor(h * 6)
  const f = h * 6 - i
  const p = v * (1 - s)
  const q = v * (1 - f * s)
  const t = v * (1 - (1 - f) * s)

  switch (i % 6) {
    case 0: r = v; g = t; b = p; break
    case 1: r = q; g = v; b = p; break
    case 2: r = p; g = v; b = t; break
    case 3: r = p; g = q; b = v; break
    case 4: r = t; g = p; b = v; break
    case 5: r = v; g = p; b = q; break
  }

  return { r, g, b }
}

export function generateColor(): Color {
  const c = HSVtoRGB(Math.random(), 1.0, 1.0)
  c.r *= 0.15
  c.g *= 0.15
  c.b *= 0.15
  return c
}

export function normalizeColor(input: Color): Color {
  return {
    r: input.r / 255,
    g: input.g / 255,
    b: input.b / 255,
  }
}

// ============================================================================
// Delta / Aspect Ratio Corrections
// ============================================================================

export function correctDeltaX(delta: number, aspectRatio: number): number {
  if (aspectRatio < 1) delta *= aspectRatio
  return delta
}

export function correctDeltaY(delta: number, aspectRatio: number): number {
  if (aspectRatio > 1) delta /= aspectRatio
  return delta
}

export function correctRadius(radius: number, aspectRatio: number): number {
  if (aspectRatio > 1) radius *= aspectRatio
  return radius
}

// ============================================================================
// Device Detection
// ============================================================================

export function isMobile(): boolean {
  return /Mobi|Android/i.test(navigator.userAgent)
}

// ============================================================================
// Resolution Helpers
// ============================================================================

export function getResolution(
  gl: GL,
  resolution: number
): { width: number; height: number } {
  let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight
  if (aspectRatio < 1) aspectRatio = 1 / aspectRatio

  const min = Math.round(resolution)
  const max = Math.round(resolution * aspectRatio)

  if (gl.drawingBufferWidth > gl.drawingBufferHeight) {
    return { width: max, height: min }
  }
  return { width: min, height: max }
}

export function getTextureScale(
  texture: DitheringTexture,
  width: number,
  height: number
): { x: number; y: number } {
  return {
    x: width / texture.width,
    y: height / texture.height,
  }
}

export function resizeCanvas(canvas: HTMLCanvasElement): boolean {
  const width = scaleByPixelRatio(canvas.clientWidth)
  const height = scaleByPixelRatio(canvas.clientHeight)
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
    return true
  }
  return false
}
