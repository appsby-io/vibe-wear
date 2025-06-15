import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DesignCounterState {
  count: number;
  increment: () => void;
  reset: () => void;
  shouldShowWaitlistModal: () => boolean;
  canGenerate: () => boolean;
}

export const useDesignCounter = create<DesignCounterState>()(
  persist(
    (set, get) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
      reset: () => set({ count: 0 }),
      shouldShowWaitlistModal: () => {
        const { count } = get();
        return count >= 3;
      },
      canGenerate: () => {
        const { count } = get();
        return count < 3;
      },
    }),
    {
      name: 'design-counter',
    }
  )
);