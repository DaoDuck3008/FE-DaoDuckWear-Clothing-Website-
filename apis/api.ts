import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// gắn access_token vào header của mọi request mọi request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().access_token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// xử lý refresh_token khi access_token hết hạn
let isRefreshing = false;
let queue: any[] = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const token = useAuthStore.getState().access_token;

    const isAuthRoute =
      originalRequest.url.includes("/auth/login") ||
      originalRequest.url.includes("/auth/register") ||
      originalRequest.url.includes("/auth/refresh");

    const hasAuthHeader =
      originalRequest.headers?.Authorization ||
      originalRequest.headers?.authorization;

    if (
      error.response?.status === 401 &&
      token &&
      hasAuthHeader &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const res = await api.post("/auth/refresh");
          const { accessToken } = res.data;

          useAuthStore
            .getState()
            .setAuth(accessToken, useAuthStore.getState().user!);

          isRefreshing = false;
          queue.forEach((cb) => cb(accessToken));
          queue = [];

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (err) {
          const hasToken = useAuthStore.getState().access_token;

          if (hasToken) {
            useAuthStore.getState().clearAuth();
            window.location.href = "/login";
          }

          return Promise.reject(err);
        }
      }

      return new Promise((resolve) => {
        queue.push((token: string) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    // Đối với các lỗi khác, chúng ta để component tự catch bằng handleError helper
    return Promise.reject(error);
  },
);
