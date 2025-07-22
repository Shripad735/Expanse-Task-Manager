const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  base: API_BASE_URL,
  expenses: `${API_BASE_URL}/api/expenses`,
  tasks: `${API_BASE_URL}/api/tasks`,
  // Add other endpoints as needed
};

export default API_BASE_URL;
