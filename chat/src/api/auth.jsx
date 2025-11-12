import axios from "axios";

const BASE_URL = "http://localhost:5000";

export const registerUser = async (username, password) => {
  return axios.post(`${BASE_URL}/register`, { username, password });
};

export const loginUser = async (username, password) => {
  return axios.post(`${BASE_URL}/login`, { username, password });
};

export const getUsers = async (token) => {
  return axios.get(`${BASE_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
