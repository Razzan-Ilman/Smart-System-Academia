import axios from "axios";

const API_URL = "https://ssa-payment.lskk.co.id/api/v1";

export interface CreateTransactionPayload {
  name: string;
  email: string;
  phone_number: string;
  payment_type: string;
  product_id: number;
  add_ons_ids: number[];
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
