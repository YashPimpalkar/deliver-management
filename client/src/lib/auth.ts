"use client";

export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const getRole = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("role");
  }
  return null;
};

export const getUserId = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("userid");
  }
  return null;
};

export const setAuth = (token: string, role: string, userid: string) => {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
  localStorage.setItem("userid", userid);
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("userid");
  window.location.href = "/login";
};
