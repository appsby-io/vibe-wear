import React from 'react';
import Lottie from 'lottie-react';
import crabAnimationData from '../assets/lottie_crab_animation.json';

interface LottieLoadingAnimationProps {
  className?: string;
  size?: number;
}

export const LottieLoadingAnimation: React.FC<LottieLoadingAnimationProps> = ({
  className = '',
  size = 120,
}) => {
  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      style={{ 
        width: size, 
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Lottie
        animationData={crabAnimationData}
        loop={true}
        autoplay={true}
        style={{ 
          width: '100%', 
          height: '100%',
          maxWidth: '100%',
          maxHeight: '100%'
        }}
        rendererSettings={{
          preserveAspectRatio: 'xMidYMid meet'
        }}
      />
    </div>
  );
};