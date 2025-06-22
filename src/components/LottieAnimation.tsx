import React from 'react';
import Lottie from 'lottie-react';

interface LottieAnimationProps {
  animationData: object;
  className?: string;
  style?: React.CSSProperties;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  onComplete?: () => void;
}

export const LottieAnimation: React.FC<LottieAnimationProps> = ({
  animationData,
  className = '',
  style = {},
  loop = true,
  autoplay = true,
  speed = 1,
  onComplete,
}) => {
  return (
    <Lottie
      animationData={animationData}
      className={className}
      style={style}
      loop={loop}
      autoplay={autoplay}
      speed={speed}
      onComplete={onComplete}
    />
  );
};