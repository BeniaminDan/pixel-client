'use client'

/**
 * @fileoverview Fluid simulation hero background component.
 *
 * This is a thin wrapper component around the useFluidSimulation hook.
 * For full control over the simulation, use the hook directly.
 *
 * @example
 * // Basic usage
 * <FluidHeroBackground />
 *
 * @example
 * // With custom config
 * <FluidHeroBackground
 *   config={{ BLOOM_INTENSITY: 2.0, SPLAT_RADIUS: 0.5 }}
 * />
 *
 * @example
 * // With ref for external control
 * const fluidRef = useRef<FluidHeroBackgroundRef>(null)
 * <FluidHeroBackground ref={fluidRef} />
 * // Later: fluidRef.current?.multipleSplats(10)
 */

import { forwardRef, useImperativeHandle } from 'react'
import { useFluidSimulation } from "@/shared/hooks/useFluidSimulation";
import type { SimConfig, Color, UseFluidSimulationReturn } from "@/shared/types/fluid-simulation";

// ============================================================================
// Types
// ============================================================================

export interface FluidHeroBackgroundProps {
  /** Additional CSS classes */
  className?: string
  /** Initial simulation configuration (includes COLOR_PALETTE for fluid colors) */
  config?: Partial<SimConfig>
  /** Whether to show the gradient overlay */
  showOverlay?: boolean
  /** Custom overlay classes */
  overlayClassName?: string
}

export type FluidHeroBackgroundRef = Omit<UseFluidSimulationReturn, 'canvasRef'>

// ============================================================================
// Component
// ============================================================================

export const FluidHeroBackground = forwardRef<FluidHeroBackgroundRef, FluidHeroBackgroundProps>(
  function FluidHeroBackground(
    { className = '', config, showOverlay = true, overlayClassName = '' },
    ref
  ) {
    const {
      canvasRef,
      config: currentConfig,
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
    } = useFluidSimulation(config)

    // Expose all controls via ref
    useImperativeHandle(ref, () => ({
      config: currentConfig,
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
    }), [
      currentConfig,
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
    ])

    return (
      <div
        className={`absolute inset-0 -z-10 overflow-hidden ${className}`}
        aria-hidden="true"
      >
        <canvas
          ref={canvasRef}
          className="h-full w-full"
          style={{ touchAction: 'none' }}
        />
        {showOverlay && (
          <div
            className={`pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/70 ${overlayClassName}`}
          />
        )}
      </div>
    )
  }
)

export default FluidHeroBackground

// Re-export types for convenience
export type { SimConfig, Color }
