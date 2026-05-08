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

export const googleLogin = async (credential: string) => {
  try {
    return api.post("/auth/google", { credential });
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

export const updateProfile = async (data: {
  username?: string;
  phone?: string;
}) => {
  return api.patch("/auth/profile", data);
};

export const uploadAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);
  return api.post("/auth/profile/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
