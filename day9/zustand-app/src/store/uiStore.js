import { create } from "zustand";

const useUIStore = create((set) => ({
  sidebarCollapsed: false,

  toggleSidebar: () =>
    set((state) => ({
      sidebarCollapsed:
        !state.sidebarCollapsed,
    })),

  openSidebar: () =>
    set({
      sidebarCollapsed: false,
    }),

  closeSidebar: () =>
    set({
      sidebarCollapsed: true,
    }),
}));

export default useUIStore;