// src/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

async function handleResponse(res) {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Error ${res.status}`);
  }
  return res.json();
}

// User registration
export async function registerUser(data) {
  const res = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// User login
export async function loginUser(data) {
  const res = await fetch(`${API_BASE_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include", // if you're using session/cookie
  });
  return handleResponse(res);
}

// Get dashboard info
export async function getDashboard() {
  const res = await fetch(`${API_BASE_URL}/api/user/dashboard`, {
    credentials: "include",
  });
  return handleResponse(res);
}

// Transfer money
export async function transferMoney(data) {
  const res = await fetch(`${API_BASE_URL}/api/user/transfer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  return handleResponse(res);
}

// Logout (optional)
export async function logoutUser() {
  const res = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  return handleResponse(res);
}
