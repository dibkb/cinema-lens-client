import { create } from "zustand";

interface HistoryState {
  tempMessages: string[];
  updateTempMessages: (message: string) => void;
  clearTempMessages: () => void;
}

const useHistoryStore = create<HistoryState>((set) => ({
  tempMessages: [],
  updateTempMessages: (message: string) =>
    set((state) => ({ tempMessages: [...state.tempMessages, message] })),
  clearTempMessages: () => set({ tempMessages: [] }),
}));

export default useHistoryStore;
