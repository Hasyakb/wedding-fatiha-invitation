import React from "react";

export interface SceneTransitionOptions {
  fadeInDuration?: number;
  fadeOutDuration?: number;
  enterTranslateY?: number;
  entryTranslateY?: number;
  exitTranslateY?: number;
  enterScale?: number;
  exitScale?: number;
  enableFloat?: boolean;
  floatSpeed?: number;
  floatAmplitude?: number;
}

export interface SceneTransitionResult {
  isVisible: boolean;
  opacity: number;
  transform: string;
  filter: string;
  style: React.CSSProperties;
}

/**
 * Calculates smooth easing, float breathing, and dissolve transitions for video scenes
 */
export function getSceneTransition(
  t: number,
  start: number,
  end: number,
  options: SceneTransitionOptions = {}
): SceneTransitionResult {
  const {
    fadeInDuration = 0.55,
    fadeOutDuration = 0.45,
    exitTranslateY = -8,
    enterScale = 0.96,
    exitScale = 1.02,
    enableFloat = true,
    floatSpeed = 1.6,
    floatAmplitude = 2.5,
  } = options;
  const enterTranslateY = options.entryTranslateY ?? options.enterTranslateY ?? 14;

  if (t < start || t >= end) {
    return {
      isVisible: false,
      opacity: 0,
      transform: "none",
      filter: "blur(4px)",
      style: { display: "none" },
    };
  }

  const timeInScene = t - start;
  const timeUntilEnd = end - t;

  let opacity = 1;
  let translateY = 0;
  let scale = 1;
  let blur = 0;

  // 1. Smooth cubic ease-out entrance
  if (timeInScene < fadeInDuration) {
    const p = Math.min(1, Math.max(0, timeInScene / fadeInDuration));
    const ease = 1 - Math.pow(1 - p, 3);
    opacity = ease;
    translateY = enterTranslateY * (1 - ease);
    scale = enterScale + (1 - enterScale) * ease;
    blur = (1 - ease) * 3;
  }
  // 2. Smooth cubic ease-in dissolve exit
  else if (timeUntilEnd < fadeOutDuration) {
    const p = Math.min(1, Math.max(0, timeUntilEnd / fadeOutDuration));
    const ease = Math.pow(p, 2);
    opacity = ease;
    translateY = exitTranslateY * (1 - ease);
    scale = 1 + (exitScale - 1) * (1 - ease);
    blur = (1 - ease) * 3;
  }

  // 3. Tactile floating micro-breath during scene
  if (enableFloat && opacity > 0.4) {
    const floatOffset = Math.sin(timeInScene * floatSpeed) * floatAmplitude;
    translateY += floatOffset;
  }

  const transform = `translate3d(0, ${translateY.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
  const filter = blur > 0.1 ? `blur(${blur.toFixed(1)}px)` : "none";

  return {
    isVisible: true,
    opacity,
    transform,
    filter,
    style: {
      opacity,
      transform,
      filter,
      willChange: "transform, opacity, filter",
    },
  };
}
