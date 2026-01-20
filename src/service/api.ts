import axios, { AxiosError } from "axios";

// ===================================================
// AXIOS INSTANCE
// ===================================================
const api = axios.create({
  baseURL: "https://ssa-payment.lskk.co.id/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// ===================================================
// REQUEST INTERCEPTOR → ATTACH TOKEN
// ===================================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ===================================================
// RESPONSE INTERCEPTOR → AUTO REFRESH TOKEN
// ===================================================
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jika error 401 dan bukan dari endpoint login/refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/login") &&
      !originalRequest.url?.includes("/refresh-token")
    ) {
      if (isRefreshing) {
        // Tambahkan request ke queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        isRefreshing = false;
        logout();
        return Promise.reject(error);
      }

      try {
        const response = await axios.put(
          "https://ssa-payment.lskk.co.id/api/v1/user/refresh-token",
          {
            refreshToken: refreshToken,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const newAccessToken =
          response.data?.access_token ||
          response.data?.data?.access_token ||
          response.data?.token ||
          response.data?.data?.token;

        const newRefreshToken =
          response.data?.refresh_token ||
          response.data?.data?.refresh_token;

        if (!newAccessToken) {
          throw new Error("Access token tidak ditemukan dari refresh API");
        }

        localStorage.setItem("token", newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem("refresh_token", newRefreshToken);
        }

        api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        isRefreshing = false;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ===================================================
// ERROR HANDLER
// ===================================================
const handleError = (error: AxiosError<any>) => {
  if (error.response) {
    console.error("API Error:", error.response.data);
    return Promise.reject(error.response.data);
  }
  console.error("Network Error:", error.message);
  return Promise.reject(error);
};

// ===================================================
// AUTH SERVICES
// ===================================================

/**
 * LOGIN USER
 * POST /user/login
 * @param email - Email pengguna
 * @param password - Password pengguna
 */
export const loginUser = async (email: string, password: string) => {
  try {
    const res = await api.post("/user/login", {
      email,
      password,
    });

    console.log("🔥 FULL RESPONSE LOGIN:", res.data);

    const data = res.data;

    // Ambil access_token dengan berbagai kemungkinan struktur response
    const accessToken =
      data?.access_token ||
      data?.data?.access_token ||
      data?.token ||
      data?.data?.token;

    // Ambil refresh_token
    const refreshToken =
      data?.refresh_token ||
      data?.data?.refresh_token;

    console.log("✅ Access Token:", accessToken);
    console.log("✅ Refresh Token:", refreshToken);

    if (!accessToken) {
      console.error("❌ Token tidak ditemukan dalam response:", data);
      throw new Error("Access token tidak ditemukan dari API");
    }

    // Simpan token ke localStorage
    localStorage.setItem("token", accessToken);

    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    }

    return data;
  } catch (err) {
    return handleError(err as AxiosError);
  }
};

/**
 * REGISTER USER
 * POST /user/register
 * @param email - Email pengguna
 * @param password - Password pengguna
 * @param name - Nama pengguna (opsional)
 */
export const registerUser = async (
  email: string,
  password: string,
  name?: string
) => {
  try {
    const res = await api.post("/user/register", {
      email,
      password,
      name,
    });

    console.log("🔥 FULL RESPONSE REGISTER:", res.data);
    return res.data;
  } catch (err) {
    return handleError(err as AxiosError);
  }
};

/**
 * REFRESH TOKEN
 * PUT /user/refresh-token
 */
export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      throw new Error("Refresh token tidak ditemukan");
    }

    const res = await axios.put(
      "https://ssa-payment.lskk.co.id/api/v1/user/refresh-token",
      {
        refreshToken: refreshToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = res.data;

    const newAccessToken =
      data?.access_token ||
      data?.data?.access_token ||
      data?.token ||
      data?.data?.token;

    const newRefreshToken =
      data?.refresh_token ||
      data?.data?.refresh_token;

    if (!newAccessToken) {
      throw new Error("Access token tidak ditemukan dari refresh API");
    }

    localStorage.setItem("token", newAccessToken);
    if (newRefreshToken) {
      localStorage.setItem("refresh_token", newRefreshToken);
    }

    return data;
  } catch (err) {
    return handleError(err as AxiosError);
  }
};

/**
 * LOGOUT
 * Hapus semua token dan redirect ke login
 */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  window.location.href = "/admin/login";
};

/**
 * GET CURRENT USER
 * GET /user/me (sesuaikan dengan endpoint API Anda)
 */
export const getCurrentUser = async () => {
  try {
    const res = await api.get("/user/me");
    return res.data;
  } catch (err) {
    return handleError(err as AxiosError);
  }
};

// ===================================================
// PAYMENT SERVICES
// ===================================================

/**
 * CREATE PAYMENT
 * POST /payment/create
 */
export const createPayment = async (paymentData: {
  amount: number;
  email: string;
  name: string;
  phone: string;
  paymentMethod: string;
}) => {
  try {
    const res = await api.post("/payment/create", paymentData);
    console.log("🔥 Payment Created:", res.data);
    return res.data;
  } catch (err) {
    return handleError(err as AxiosError);
  }
};

/**
 * CHECK PAYMENT STATUS
 * GET /payment/status/:orderId
 */
export const checkPaymentStatus = async (orderId: string) => {
  try {
    const res = await api.get(`/payment/status/${orderId}`);
    return res.data;
  } catch (err) {
    return handleError(err as AxiosError);
  }
};

/**
 * GET PAYMENT HISTORY
 * GET /payment/history
 */
export const getPaymentHistory = async () => {
  try {
    const res = await api.get("/payment/history");
    return res.data;
  } catch (err) {
    return handleError(err as AxiosError);
  }
};

// ===================================================
// UTILITY FUNCTIONS
// ===================================================

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};

/**
 * Get stored token
 */
export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

/**
 * Get stored refresh token
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refresh_token");
};

// ===================================================
// EXPORT AXIOS INSTANCE
// ===================================================
export default api;