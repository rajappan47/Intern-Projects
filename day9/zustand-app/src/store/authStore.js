import { create } from "zustand";
import { loginApi } from "../api/authApi";

const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  login: async ({ email, password }) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const user = await loginApi(email, password);

      set({
        user,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: error.message,
      });
    }
  },

  logout: () =>
    set({
      user: null,
      error: null,
    }),
}));

export default useAuthStore;