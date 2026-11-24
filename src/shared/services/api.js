/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: shared/services/api.js
 * Axios instance chuẩn hóa với cơ chế Mutex Request Queue ngăn ngừa Race Condition khi Token Refresh.
 */
import axios from 'axios';
import { useAuthStore } from '../../app/store/authStore';
import { shouldSkipTokenRefresh } from '../utils/authRefresh';

/**
 * Axios instance dùng chung cho toàn bộ FE.
 *
 * Luồng auth:
 * - BE lưu access token/refresh token trong HTTP-only cookie hoặc header Authorization.
 * - withCredentials: true giúp browser tự động gửi cookie kèm request.
 * - Mutex Token Refresh: Khi nhiều request đồng thời gặp 401, chỉ đúng 1 request được gửi
 *   lệnh /auth/refresh, các request còn lại được xếp hàng vào queue chờ kết quả để retry.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Mutex lock và hàng đợi request khi đang refresh token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor gửi token kèm request
api.interceptors.request.use(
  (config) => {
    config.withCredentials = config.withCredentials !== false;
    const token = useAuthStore.getState().token;
    if (token && !config.skipBearer) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios instance for public endpoints (does not send cookies or tokens)
export const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor xử lý response và tự động refresh token với Mutex Queue khi gặp lỗi 401
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.skipAuthRefresh &&
      !shouldSkipTokenRefresh(originalRequest.url)
    ) {
      if (isRefreshing) {
        // Nếu đang có tiến trình refresh token chạy ngầm, đẩy request vào hàng đợi
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/auth/refresh`,
          null,
          { withCredentials: true, skipBearer: true, skipAuthRefresh: true }
        );

        if (res.status === 200) {
          const newToken = res.data?.token || res.data?.data?.token || null;

          if (newToken) {
            const { loginSuccess } = useAuthStore.getState();
            loginSuccess(newToken);
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          }

          processQueue(null, newToken);
          return api(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        const { logout } = useAuthStore.getState();
        logout();
        localStorage.removeItem('researchpulse_token');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Nếu đã retry hoặc không thể refresh, thực hiện dọn dẹp phiên
    if (error.response && error.response.status === 401) {
      const { logout } = useAuthStore.getState();
      logout();
      localStorage.removeItem('researchpulse_token');
    }

    return Promise.reject(error);
  }
);

export default api;
