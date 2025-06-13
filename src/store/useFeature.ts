import { create } from 'zustand';

interface FeatureState {
  features: Record<string, boolean>;
  setFeature: (key: string, value: boolean) => void;
  getFeature: (key: string) => boolean;
}

const useFeatureStore = create<FeatureState>((set, get) => ({
  features: {
    betaGate: import.meta.env.VITE_FEATURE_BETA_GATE === 'on',
  },
  setFeature: (key: string, value: boolean) =>
    set((state) => ({
      features: { ...state.features, [key]: value },
    })),
  getFeature: (key: string) => get().features[key] || false,
}));

export const useFeature = (featureKey: string): boolean => {
  const getFeature = useFeatureStore((state) => state.getFeature);
  return getFeature(featureKey);
};

export const useFeatureToggle = () => {
  const setFeature = useFeatureStore((state) => state.setFeature);
  return setFeature;
};