import axiosInstance from './axiosInstance';

export interface TransactionDetail {
    id: number;
    trxId: string;
    name: string;
    product: string;
    nominal: string;
    method: string;
    status: string;
    date: string;
}

class TransactionService {
    private endpoint = '/transactions';

    // Get all transactions
    async getAll(): Promise<TransactionDetail[]> {
        try {
            const response = await axiosInstance.get<TransactionDetail[]>(this.endpoint);
            return response.data;
        } catch (error) {
            // Fallback to mock data
            return [
                { id: 1, trxId: "TRX001", name: "John Doe", product: "Kursus React", nominal: "Rp 500.000", method: "Transfer Bank", status: "Success", date: "2024-01-15" },
                { id: 2, trxId: "TRX002", name: "Jane Smith", product: "Buku Design System", nominal: "Rp 150.000", method: "E-Wallet", status: "Success", date: "2024-01-16" },
                { id: 3, trxId: "TRX003", name: "Bob Johnson", product: "Top-Up Saldo", nominal: "Rp 1.000.000", method: "Transfer Bank", status: "Pending", date: "2024-01-17" },
                { id: 4, trxId: "TRX004", name: "Alice Brown", product: "Sertifikat Web Dev", nominal: "Rp 300.000", method: "Midtrans", status: "Success", date: "2024-01-18" },
                { id: 5, trxId: "TRX005", name: "Charlie Wilson", product: "Paket Masterclass", nominal: "Rp 750.000", method: "E-Wallet", status: "Failed", date: "2024-01-19" },
            ];
        }
    }

    // Get transaction by ID
    async getById(id: number): Promise<TransactionDetail | null> {
        try {
            const response = await axiosInstance.get<TransactionDetail>(`${this.endpoint}/${id}`);
            return response.data;
        } catch (error) {
            return null;
        }
    }

    // Update transaction status
    async updateStatus(id: number, status: string): Promise<TransactionDetail> {
        try {
            const response = await axiosInstance.patch<TransactionDetail>(
                `${this.endpoint}/${id}/status`,
                { status }
            );
            return response.data;
        } catch (error) {
            throw new Error('Failed to update transaction status');
        }
    }
}

export default new TransactionService();
