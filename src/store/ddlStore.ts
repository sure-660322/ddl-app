import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Ddl } from '../types';
import { generateId } from '../utils/time';

interface DdlState {
  ddls: Ddl[];
  addDdl: (name: string, deadline: number) => void;
  toggleComplete: (id: string) => void;
  checkExpired: () => void;
}

export const useDdlStore = create<DdlState>()(
  persist(
    (set) => ({
      ddls: [],

      addDdl: (name, deadline) => {
        const newDdl: Ddl = {
          id: generateId(),
          name: name.trim(),
          deadline,
          status: 'active',
          createdAt: Date.now(),
        };
        set((state) => ({ ddls: [...state.ddls, newDdl] }));
      },

      toggleComplete: (id) => {
        set((state) => ({
          ddls: state.ddls.map((ddl) => {
            if (ddl.id !== id) return ddl;
            if (ddl.status === 'expired') return ddl;
            return {
              ...ddl,
              status: ddl.status === 'completed' ? 'active' : 'completed',
            };
          }),
        }));
      },

      checkExpired: () => {
        const now = Date.now();
        set((state) => ({
          ddls: state.ddls.map((ddl) => {
            if (ddl.status === 'active' && ddl.deadline < now) {
              return { ...ddl, status: 'expired' as const };
            }
            return ddl;
          }),
        }));
      },
    }),
    {
      name: 'ddl-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ ddls: state.ddls }),
    }
  )
);
