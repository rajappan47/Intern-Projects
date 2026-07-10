import axios from "axios";
import { notification } from "antd"; // Import Antd notification directly into the API layer

const api = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 10000, // 10 second timeout
});

// ==========================================
// REQUEST INTERCEPTOR (Before request goes out)
// ==========================================
api.interceptors.request.use(
  (config) => {
    // Scenario A: Add a mock authorization token automatically to every request
    const mockToken = "my-secret-auth-token-123";
    if (mockToken) {
      config.headers.Authorization = `Bearer ${mockToken}`;
    }

    // Scenario B: Add custom content type if missing
    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    console.log(`[Interceptor Request] ${config.method.toUpperCase()} to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// RESPONSE INTERCEPTOR (When response arrives)
// ==========================================
api.interceptors.response.use(
  (response) => {
    console.log(`[Interceptor Response] Success from ${response.config.url}`);
    return response;
  },
  (error) => {
    // GLOBAL ERROR HANDLING: Catch errors globally so you don't repeat yourself in UI files
    const status = error.response ? error.response.status : null;
    let errorMessage = "A network error occurred. Please try again.";

    if (status === 401) {
      errorMessage = "Unauthorized! Please log in again.";
      // Optional: redirect to login page here
    } else if (status === 403) {
      errorMessage = "You do not have permission to perform this action.";
    } else if (status === 404) {
      errorMessage = "The requested resource was not found.";
    } else if (status === 500) {
      errorMessage = "Internal Server Error. Please contact support.";
    } else if (error.message === "Network Error") {
      errorMessage = "Cannot connect to server. Is your backend running on port 5000?";
    }

    // Display global Ant Design notification
    notification.error({
      message: `API Error (${status || "Network"})`,
      description: errorMessage,
      placement: "topRight",
    });

    console.error(` [Interceptor Error]`, error);
    return Promise.reject(error);
  }
);

export default api;