import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const loginApi = async (email, password) => {
  const response = await axios.get(
    `${API_URL}/users?email=${email}`
  );

  const users = response.data;

  if (users.length === 0) {
    throw new Error("User not found");
  }

  const user = users[0];

  if (user.password !== password) {
    throw new Error("Invalid Password");
  }

  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
};