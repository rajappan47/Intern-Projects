import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",

  initialState: {
    sidebarCollapsed: false,
  },

  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed =
        !state.sidebarCollapsed;
    },

    closeSidebar: (state) => {
      state.sidebarCollapsed = true;
    },

    openSidebar: (state) => {
      state.sidebarCollapsed = false;
    },
  },
});

export const {
  toggleSidebar,
  closeSidebar,
  openSidebar,
} = uiSlice.actions;

export default uiSlice.reducer;