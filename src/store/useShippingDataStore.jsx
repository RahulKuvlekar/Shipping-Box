import { create } from "zustand";
import { combine, persist } from "zustand/middleware";

export const useShippingDataStore = create(
  persist(
    combine(
      {
        shippingData: [],
      },
      (set, get) => ({
        addShippingData: (data) =>
          set((state) => ({ shippingData: [...state.shippingData, data] })),
        setShippingData: (data) => set({ shippingData: data }),
        getShippingData: () => get().shippingData,
      })
    ),
    {
      name: "shipping-data-storage",
      partialize: (state) => ({ shippingData: state.shippingData }),
    }
  )
);
