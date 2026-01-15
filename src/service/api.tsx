import axios, { AxiosError } from "axios";

// ————————————————————————————
// BASE CONFIG
// ————————————————————————————

const api = axios.create({
  baseURL: "https://ssa-payment.lskk.co.id/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Interceptor to attach token if you use auth
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // atau dari redux / context
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Centralized response error handler
const handleError = (error: AxiosError<any>) => {
  if (error.response) {
    // Server responded with a status out of 2xx
    console.log("API Error:", error.response.data);
    return Promise.reject(error.response.data);
  }
  return Promise.reject(error);
};

export default api;

// ————————————————————————————
// GENERAL API EXAMPLES
// ————————————————————————————

/**
 * Example: GET list of something
 */
export const fetchProducts = async () => {
  try {
    const response = await api.get("/products");
    return response.data;
  } catch (err) {
    return handleError(err as AxiosError);
  }
};

/**
 * Example: POST login / auth
 */
export const postLogin = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (err) {
    return handleError(err as AxiosError);
  }
};

/**
 * Submit checkout payment
 */
export const postCheckout = async (data: any) => {
  try {
    const response = await api.post("/checkout", data);
    return response.data;
  } catch (err) {
    return handleError(err as AxiosError);
  }
};

/**
 * Get detail of a specific payment
 */
export const getPaymentDetail = async (id: string) => {
  try {
    const response = await api.get(`/payment/${id}`);
    return response.data;
  } catch (err) {
    return handleError(err as AxiosError);
  }
};
