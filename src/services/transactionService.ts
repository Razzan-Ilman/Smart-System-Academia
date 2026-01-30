import axiosInstance from "./axiosInstance";


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
  gross_amount?: number;
  price?: number;
  [key: string]: any; // Allow indexing for safe access during debug
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
   * Endpoint: GET /transaksi
   */
  getHistory: async (
    page = 1,
    limit = 10,
    search = "",
    paymentType = "",
    status = ""
  ): Promise<TransactionHistoryResponse> => {
    try {
      const response = await axiosInstance.get('/transaksi/history', {
        params: { page, limit, search, payment_type: paymentType, status },
      });
      return response.data;
    } catch (error: any) {
      console.error("❌ Service Error - getHistory:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * ✅ CREATE TRANSACTION
   * Endpoint: POST /transaksi
   */
  create: async (payload: CreateTransactionPayload) => {
    try {
      const response = await axiosInstance.post('/transaksi', payload);
      return response.data;
    } catch (error: any) {
      console.error("❌ Service Error - create:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * ✅ CHECK PAYMENT STATUS
   * Endpoint: GET /transaksi/check/:trxId
   */
  checkPayment: async (trxId: string) => {
    try {
      const response = await axiosInstance.get(`/transaksi/check/${trxId}`);
      return response.data;
    } catch (error: any) {
      console.error("❌ Service Error - checkPayment:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * ✅ CONFIRM PAYMENT (Admin only)
   * Endpoint: PUT /transaksi/:id/confirm-payment
   */
  confirmPayment: async (id: string, originalReferenceNo: string) => {
    try {
      const response = await axiosInstance.put(`/transaksi/${id}/confirm-payment`, {
        originalReferenceNo,
      });
      return response.data;
    } catch (error: any) {
      console.error("❌ Service Error - confirmPayment:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * ✅ DELETE TRANSACTION (Admin only)
   * Endpoint: DELETE /transaksi/:id
   */
  delete: async (id: number | string) => {
    try {
      const response = await axiosInstance.delete(`/transaksi/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("❌ Service Error - delete:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * ✅ CANCEL EXPIRED TRANSACTIONS
   * Endpoint: POST /transaksi/cancel-expired
   * Auto-cancel all pending transactions that are older than specified hours
   */
  cancelExpiredTransactions: async (hoursThreshold = 24) => {
    try {
      const response = await axiosInstance.post('/transaksi/cancel-expired', {
        hours: hoursThreshold
      });
      return response.data;
    } catch (error: any) {
      console.error("❌ Service Error - cancelExpiredTransactions:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * ✅ GET DASHBOARD STATS
   * ⚠️ TEMPORARY WORKAROUND: Fetch ALL transactions to calculate accurate stats
   * 
   * TODO (Backend): Create dedicated endpoint /dashboard/stats or /transaksi/stats
   * that returns pre-aggregated data from database instead of client-side calculation.
   * This will be much more efficient and scalable.
   * 
   * Current approach: Fetch with high limit (10000) to get all transactions
   * Problem: Not scalable for large databases (>10k transactions)
   */
  getDashboardStats: async () => {
    try {
      // ⚠️ CRITICAL FIX: Use high limit to fetch ALL transactions
      // Without this, stats will only calculate from first 10 transactions (default pagination)
      const response = await axiosInstance.get('/transaksi/history', {
        params: {
          page: 1,
          limit: 10000, // High limit to ensure we get ALL transactions
          // Backend should have /stats endpoint instead
        }
      });

      // Handle potentially nested data structures
      let transactions = [];
      if (Array.isArray(response.data)) {
        transactions = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        transactions = response.data.data;
      } else if (response.data?.data?.transactions && Array.isArray(response.data.data.transactions)) {
        transactions = response.data.data.transactions;
      } else if (response.data && Array.isArray(response.data.transactions)) {
        transactions = response.data.transactions;
      }

      console.log('📊 Dashboard Stats - Total transactions fetched:', transactions.length);

      // Import utils inside function or ensure they are imported at top
      const {
        calculateTotalRevenue,
        calculateTotalSales,
        groupByStatus,
        groupByPaymentType,
        groupByProduct
      } = await import('../utils/transactionUtils');

      const stats = {
        totalRevenue: calculateTotalRevenue(transactions),
        totalSales: calculateTotalSales(transactions),
        statsByStatus: groupByStatus(transactions),
        statsByPayment: groupByPaymentType(transactions),
        statsByProduct: groupByProduct(transactions)
      };

      console.log('📊 Dashboard Stats calculated:', {
        totalRevenue: stats.totalRevenue,
        totalSales: stats.totalSales,
        transactionsCount: transactions.length
      });

      return stats;
    } catch (error) {
      console.error('❌ Failed to get dashboard stats:', error);
      return {
        totalRevenue: 0,
        totalSales: 0,
        statsByStatus: [],
        statsByPayment: [],
        statsByProduct: []
      };
    }
  },
};

/* =========================
   EXPORTS (CLEAN)
========================= */

// ⚠️ IMPORTANT: Do NOT confuse these functions:
// - checkPaymentStatus: READ ONLY - Check payment status WITHOUT modifying
// - confirmTransaction: WRITE - Manually confirm a payment (admin only)

export const createTransaction = transactionService.create;
export const checkPaymentStatus = transactionService.checkPayment;
export const confirmTransaction = transactionService.confirmPayment;
export const getTransactionHistory = transactionService.getHistory;
export const deleteTransaction = transactionService.delete;
export const cancelExpiredTransactions = transactionService.cancelExpiredTransactions;