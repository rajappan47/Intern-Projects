import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const getTasksApi = async () => {
  const response = await axios.get(`${API_URL}/tasks`);
  return response.data;
};

export const addTaskApi = async (task) => {
  const response = await axios.post(
    `${API_URL}/tasks`,
    task
  );

  return response.data;
};

export const updateTaskApi = async (task) => {
  const response = await axios.put(
    `${API_URL}/tasks/${task.id}`,
    task
  );

  return response.data;
};

export const deleteTaskApi = async (id) => {
  await axios.delete(`${API_URL}/tasks/${id}`);

  return id;
};