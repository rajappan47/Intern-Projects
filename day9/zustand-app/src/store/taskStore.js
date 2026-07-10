import { create } from "zustand";

import {
  getTasksApi,
  addTaskApi,
  updateTaskApi,
  deleteTaskApi,
} from "../api/taskApi";

const useTaskStore = create((set, get) => ({
  tasks: [],

  loading: false,

  error: null,

  fetchTasks: async () => {
    set({
      loading: true,
    });

    const tasks = await getTasksApi();

    set({
      tasks,
      loading: false,
    });
  },

  addTask: async (task) => {
    const newTask = await addTaskApi(task);

    set({
      tasks: [...get().tasks, newTask],
    });
  },

  updateTask: async (task) => {
    const updated = await updateTaskApi(task);

    set({
      tasks: get().tasks.map((t) =>
        t.id === updated.id ? updated : t
      ),
    });
  },

  deleteTask: async (id) => {
    await deleteTaskApi(id);

    set({
      tasks: get().tasks.filter(
        (task) => task.id !== id
      ),
    });
  },
}));

export default useTaskStore;