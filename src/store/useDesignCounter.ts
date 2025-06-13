import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DesignCounterState {
  count: number;
  increment: () => void;
  reset: () => void;
}

export const useDesignCounter = create<DesignCounterState>()(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
      reset: () => set({ count: 0 }),
    }),
    {
      name: 'design-counter',
    }
  )
);