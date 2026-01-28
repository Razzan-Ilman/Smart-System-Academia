import { VALID_TRANSACTION_STATUS } from '../constants/transactionConstants';

export interface PieChartData {
    name: string;
    value: number;
}

export interface BarChartData {
    name: string;
    value: number;
}

/**
 * Format number to IDR currency
 */
export const formatRupiah = (num: number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(num);

/**
 * Standardize status for display (capitalized)
 */
const normalizeStatus = (status: string): string => {
    if (!status) return "Unknown";
    const s = status.toLowerCase();
    if (["success", "paid", "settlement"].includes(s)) return "Success";
    if (["pending"].includes(s)) return "Pending";
    if (["failed", "expire", "cancel", "cancelled"].includes(s)) return "Failed";
    return s.charAt(0).toUpperCase() + s.slice(1);
};

/**
 * Calculate total revenue from successful transactions
 */
export const calculateTotalRevenue = (transactions: any[]): number => {
    if (!Array.isArray(transactions)) return 0;

    return transactions.reduce((sum, trx) => {
        const status = (trx.status || "").toLowerCase();
        if (VALID_TRANSACTION_STATUS.includes(status)) {
            const amount = trx.gross_amount ||
                trx.GrossAmount ||
                trx.total_price ||
                trx.TotalPrice ||
                trx.price ||
                trx.amount ||
                0;
            return sum + Number(amount);
        }
        return sum;
    }, 0);
};

/**
 * Calculate total count of successful transactions
 */
export const calculateTotalSales = (transactions: any[]): number => {
    if (!Array.isArray(transactions)) return 0;

    return transactions.filter(trx => {
        const status = (trx.status || "").toLowerCase();
        return VALID_TRANSACTION_STATUS.includes(status);
    }).length;
};

/**
 * Group transactions by Status -> Pie Chart
 */
export const groupByStatus = (transactions: any[]): PieChartData[] => {
    if (!Array.isArray(transactions)) return [];

    const statusCounts: Record<string, number> = {};

    transactions.forEach(trx => {
        const rawStatus = trx.status || "Unknown";
        const label = normalizeStatus(rawStatus);

        statusCounts[label] = (statusCounts[label] || 0) + 1;
    });

    return Object.entries(statusCounts).map(([name, value]) => ({
        name,
        value
    }));
};

/**
 * Group transactions by Payment Type -> Bar Chart
 */
export const groupByPaymentType = (transactions: any[]): BarChartData[] => {
    if (!Array.isArray(transactions)) return [];

    const validAndPending = transactions.filter(trx => {
        const status = (trx.status || "").toLowerCase();
        return VALID_TRANSACTION_STATUS.includes(status) || status === 'pending';
    });

    const counts: Record<string, number> = {};

    validAndPending.forEach(trx => {
        // Handle various payment type field names
        const rawType = trx.payment_type || trx.paymentType || "Other";
        // Convert 'bank_transfer' -> 'Bank Transfer'
        const label = rawType.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());

        counts[label] = (counts[label] || 0) + 1;
    });

    return Object.entries(counts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value); // Sort desc
};

/**
 * Group transactions by Product -> Bar Chart
 * Only counts successful transactions
 */
export const groupByProduct = (transactions: any[]): BarChartData[] => {
    if (!Array.isArray(transactions)) return [];

    const successfulTrx = transactions.filter(trx => {
        const status = (trx.status || "").toLowerCase();
        return VALID_TRANSACTION_STATUS.includes(status);
    });

    const counts: Record<string, number> = {};

    successfulTrx.forEach(trx => {
        const product = trx.product_name || trx.name || "Unknown Product";
        counts[product] = (counts[product] || 0) + 1;
    });

    return Object.entries(counts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5); // Top 5 products
};
