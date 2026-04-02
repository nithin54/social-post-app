import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api"
});

const getErrorMessage = (error) =>
  error.response?.data?.message || "Something went wrong. Please try again.";

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export async function authSignup(payload) {
  try {
    const response = await api.post("/auth/signup", payload);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function authLogin(payload) {
  try {
    const response = await api.post("/auth/login", payload);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function fetchPosts() {
  try {
    const response = await api.get("/posts");
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function createPost(payload) {
  try {
    const response = await api.post("/posts", payload);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function toggleLike(postId) {
  try {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function addComment(postId, content) {
  try {
    const response = await api.post(`/posts/${postId}/comments`, { content });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
