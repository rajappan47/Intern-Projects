const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/**
 * 1. SECURE LOGIN API
 */
export const mockLoginApi = async (email, password) => {
  const response = await fetch(`${BASE_URL}/users?email=${encodeURIComponent(email)}`);
  
  if (!response.ok) {
    throw new Error("Unable to connect to authentication server endpoint.");
  }

  const usersFound = await response.json();

  if (usersFound.length === 0 || usersFound[0].password !== password) {
    throw new Error("Invalid username or password. Access Denied.");
  }

  return {
    success: true,
    message: "Login verified successfully",
    data: { 
      id: usersFound[0].id, // Returning the specific user ID
      email: usersFound[0].email, 
      token: `real-auth-token-${usersFound[0].id}` 
    }
  };
};

/**
 * 2. GET USER-SPECIFIC TASKS
 * Fetches only tasks belonging to the logged-in user
 */
export const fetchTasksApi = async (userId) => {
  // Filters tasks database collection by userId
  const response = await fetch(`${BASE_URL}/tasks?userId=${userId}`);
  if (!response.ok) {
    throw new Error("Failed to retrieve system tasks from database server.");
  }
  return await response.json();
};

/**
 * 3. POST NEW TASK WITH USER ID
 */
export const mockAddTaskApi = async (title, priority, userId) => {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, priority, status: "Pending", userId }), // Attaching creator's ID
  });

  if (!response.ok) {
    throw new Error("Failed to commit and write new task payload to database.");
  }
  
  const savedData = await response.json();
  return {
    success: true,
    message: "Task successfully saved to db.json",
    data: savedData
  };
};

/**
 * 4. PATCH TASK STATUS
 */
export const updateTaskStatusApi = async (id, currentTaskData, newStatus) => {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...currentTaskData, status: newStatus }),
  });

  if (!response.ok) {
    throw new Error("Failed to update task status on the database server.");
  }

  return await response.json();
};