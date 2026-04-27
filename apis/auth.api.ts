import { api } from "./api";
import { RegisterForm, LoginForm } from "@/types/auth.type";

export const register = async (data: RegisterForm) => {
  try {
    return api.post("/auth/register", data);
  } catch (error: any) {
    throw error;
  }
};

export const login = async (data: LoginForm) => {
  try {
    return api.post("/auth/login", data);
  } catch (error: any) {
    throw error;
  }
};

export const logout = async () => {
  try {
    return api.post("/auth/logout");
  } catch (error: any) {
    throw error;
  }
};

export const refresh = async () => {
  return api.post("/auth/refresh");
};

export const getProfile = async () => {
  try {
    return api.get("/auth/profile");
  } catch (error: any) {
    throw error;
  }
};
