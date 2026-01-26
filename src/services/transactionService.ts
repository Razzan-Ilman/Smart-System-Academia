import axios from "axios";

// ✅ Arahkan ke backend proxy kamu
const API_URL = "http://localhost:3001/api";

/* =========================
   TYPES
========================= */

export interface CreateTransactionPayload {
  name: string;
  email: string;
  phone_number: string;
  payment_type: string;
  product_id: string;
  add_ons_ids?: string[];
}

export interface Transaction {
  id: number | string;
  trx_id: string;
  name: string;
  email: string;
  phone_number: string;
  payment_type: string;
  product_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionHistoryResponse {
  code: number;
  message: string;
  data: {
    transactions: Transaction[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

/* =========================
   SERVICE
========================= */

export const transactionService = {
  /**
   * ✅ GET TRANSACTION HISTORY
   * Endpoint: GET /api/transactions/history
   */
  getHistory: async (
    page = 1,
    limit = 10,
    search = "",
    paymentType = ""
  ): Promise<TransactionHistoryResponse> => {
    try {
      const response = await axios.get(`${API_URL}/transactions/history`, {
        params: { page, limit, search, payment_type: paymentType },
      });
      return response.data;
    } catch (error: any) {
      console.error("❌ Service Error - getHistory:", error.response?.data);
      throw error;
    }
  },

  /**
   * ✅ CREATE TRANSACTION
   * Endpoint: POST /api/transactions
   */
  create: async (payload: CreateTransactionPayload) => {
    try {
      const response = await axios.post(`${API_URL}/transactions`, payload);
      return response.data;
    } catch (error: any) {
      console.error("❌ Service Error - create:", error.response?.data);
      throw error;
    }
  },

  /**
   * ✅ CHECK PAYMENT STATUS
   * Endpoint: GET /api/transactions/check/:trxId
   */
  checkPayment: async (trxId: string) => {
    try {
      const response = await axios.get(`${API_URL}/transactions/check/${trxId}`);
      return response.data;
    } catch (error: any) {
      console.error("❌ Service Error - checkPayment:", error.response?.data);
      throw error;
    }
  },

  /**
   * ✅ CONFIRM PAYMENT (Admin only)
   * Endpoint: PUT /api/transactions/:id/confirm
   */
  confirmPayment: async (id: string, originalReferenceNo: string) => {
    try {
      const response = await axios.put(`${API_URL}/transactions/${id}/confirm`, {
        originalReferenceNo,
      });
      return response.data;
    } catch (error: any) {
      console.error("❌ Service Error - confirmPayment:", error.response?.data);
      throw error;
    }
  },
};

/* =========================
   EXPORTS (CLEAN)
========================= */

export const createTransaction = transactionService.create;
export const checkPaymentStatus = transactionService.checkPayment;
export const confirmTransaction = transactionService.confirmPayment;
export const getTransactionHistory = transactionService.getHistory;