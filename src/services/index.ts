// Export all services
export { default as productService } from './productService';
export { default as categoryService } from './categoryService';
export { default as transactionService } from './transactionService';
export { default as axiosInstance } from './axiosInstance';

// Export types
export type { Product, AddOn } from './productService';
export type { Category } from './categoryService';
export type { TransactionDetail } from './transactionService';
