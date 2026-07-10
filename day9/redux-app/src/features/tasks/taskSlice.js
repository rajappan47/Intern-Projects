import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getTasksApi,
  addTaskApi,
  updateTaskApi,
  deleteTaskApi,
} from "../../api/taskApi";

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async () => {
    return await getTasksApi();
  }
);

export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (task) => {
    return await addTaskApi(task);
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (task) => {
    return await updateTaskApi(task);
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id) => {
    await deleteTaskApi(id);
    return id;
  }
);

const taskSlice = createSlice({
  name: "tasks",

  initialState: {
    tasks: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })

      .addCase(fetchTasks.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch tasks";
      })

      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })

      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (task) => task.id === action.payload.id
        );

        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })

      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(
          (task) => task.id !== action.payload
        );
      });
  },
});

export default taskSlice.reducer;