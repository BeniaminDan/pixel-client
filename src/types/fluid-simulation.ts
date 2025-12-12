/**
 * @fileoverview Type definitions for the WebGL fluid simulation.
 */

// ============================================================================
// WebGL Type Alias
// ============================================================================

export type GL = WebGL2RenderingContext | WebGLRenderingContext

// ============================================================================
// Color Types
// ============================================================================

export interface Color {
  r: number
  g: number
  b: number
}

// ============================================================================
// Texture Types
// ============================================================================

export interface TextureFormat {
  internalFormat: number
  format: number
}

// ============================================================================
// Framebuffer Types
// ============================================================================

export interface FBO {
  texture: WebGLTexture
  fbo: WebGLFramebuffer
  width: number
  height: number
  texelSizeX: number
  texelSizeY: number
  attach: (id: number) => number
}

export interface DoubleFBO {
  width: number
  height: number
  texelSizeX: number
  texelSizeY: number
  read: FBO
  write: FBO
  swap: () => void
}

export interface DitheringTexture {
  texture: WebGLTexture
  width: number
  height: number
  attach: (id: number) => number
}

// ============================================================================
// Pointer / Input Types
// ============================================================================

export interface PointerData {
  id: number
  texcoordX: number
  texcoordY: number
  prevTexcoordX: number
  prevTexcoordY: number
  deltaX: number
  deltaY: number
  down: boolean
  moved: boolean
  color: Color
}

// ============================================================================
// WebGL Extensions
// ============================================================================

export interface WebGLExtensions {
  formatRGBA: TextureFormat | null
  formatRG: TextureFormat | null
  formatR: TextureFormat | null
  halfFloatTexType: number
  supportLinearFiltering: OES_texture_float_linear | OES_texture_half_float_linear | null
}

// ============================================================================
// Simulation Configuration
// ============================================================================

export interface SimConfig {
  SIM_RESOLUTION: number
  DYE_RESOLUTION: number
  CAPTURE_RESOLUTION: number
  DENSITY_DISSIPATION: number
  VELOCITY_DISSIPATION: number
  PRESSURE: number
  PRESSURE_ITERATIONS: number
  CURL: number
  SPLAT_RADIUS: number
  SPLAT_FORCE: number
  SHADING: boolean
  COLORFUL: boolean
  COLOR_UPDATE_SPEED: number
  PAUSED: boolean
  BACK_COLOR: Color
  BACK_TRANSPARENT: boolean
  TRANSPARENT: boolean
  BLOOM: boolean
  BLOOM_ITERATIONS: number
  BLOOM_RESOLUTION: number
  BLOOM_INTENSITY: number
  BLOOM_THRESHOLD: number
  BLOOM_SOFT_KNEE: number
  SUNRAYS: boolean
  SUNRAYS_RESOLUTION: number
  SUNRAYS_WEIGHT: number
  /** 
   * Optional color palette for fluid splats. If provided, colors will be picked from this palette instead of random generation.
   * Accepts either Color objects (normalized RGB 0-1) or CSS color strings (hex, rgb, rgba, hsl, named colors, CSS variables).
   */
  COLOR_PALETTE?: (Color | string)[]
}

// ============================================================================
// Hook Return Type
// ============================================================================

export interface UseFluidSimulationReturn {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  config: SimConfig
  // Control methods
  pause: () => void
  resume: () => void
  togglePause: () => void
  splat: (x: number, y: number, dx: number, dy: number, color?: Color) => void
  multipleSplats: (count: number) => void
  // Individual setters for each config option
  setSimResolution: (value: number) => void
  setDyeResolution: (value: number) => void
  setDensityDissipation: (value: number) => void
  setVelocityDissipation: (value: number) => void
  setPressure: (value: number) => void
  setPressureIterations: (value: number) => void
  setCurl: (value: number) => void
  setSplatRadius: (value: number) => void
  setSplatForce: (value: number) => void
  setShading: (value: boolean) => void
  setColorful: (value: boolean) => void
  setColorUpdateSpeed: (value: number) => void
  setBackColor: (value: Color) => void
  setTransparent: (value: boolean) => void
  setBloom: (value: boolean) => void
  setBloomIterations: (value: number) => void
  setBloomResolution: (value: number) => void
  setBloomIntensity: (value: number) => void
  setBloomThreshold: (value: number) => void
  setBloomSoftKnee: (value: number) => void
  setSunrays: (value: boolean) => void
  setSunraysResolution: (value: number) => void
  setSunraysWeight: (value: number) => void
  setColorPalette: (colors: (Color | string)[] | undefined) => void
}
