import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import taskReducer from "../features/tasks/taskSlice";
import uiReducer from "../features/ui/uiSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    ui: uiReducer,
  },
});

export default store;