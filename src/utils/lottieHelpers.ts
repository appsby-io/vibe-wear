// Utility functions for working with Lottie animations

export const loadLottieAnimation = async (path: string) => {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load animation: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading Lottie animation:', error);
    return null;
  }
};

export const createLottieConfig = (
  animationData: object,
  options: {
    loop?: boolean;
    autoplay?: boolean;
    speed?: number;
    direction?: 1 | -1;
  } = {}
) => {
  return {
    animationData,
    loop: options.loop ?? true,
    autoplay: options.autoplay ?? true,
    speed: options.speed ?? 1,
    direction: options.direction ?? 1,
  };
};

// Common animation presets
export const ANIMATION_PRESETS = {
  loading: {
    loop: true,
    autoplay: true,
    speed: 1,
  },
  success: {
    loop: false,
    autoplay: true,
    speed: 1,
  },
  error: {
    loop: false,
    autoplay: true,
    speed: 1,
  },
  hover: {
    loop: false,
    autoplay: false,
    speed: 1.5,
  },
} as const;