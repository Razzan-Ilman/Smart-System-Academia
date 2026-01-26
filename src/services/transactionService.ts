import axios from "axios";

const API_URL = "https://ssa-payment.lskk.co.id/api/v1";

export interface CreateTransactionPayload {
  name: string;
  email: string;
  phone_number: string;
  payment_type: string;
  product_id: string;
  add_ons_ids: string[];
}

export const createTransaction = async (
  payload: CreateTransactionPayload
) => {
  const response = await axios.post(
    `${API_URL}/transaksi`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const getTransactionById = async (id: number | string) => {
  const response = await axios.get(`${API_URL}/transaksi/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const getTransactionByTrxId = async (trxId: string) => {
  const response = await axios.get(`${API_URL}/transaksi/${trxId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const confirmTransaction = async (id: string, originalReferenceNo: string) => {
  const response = await axios.put(`${API_URL}/transaksi/${id}/confirm-payment`, {
    originalReferenceNo: originalReferenceNo
  }, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

