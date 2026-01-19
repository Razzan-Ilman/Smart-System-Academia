import axiosInstance from './axiosInstance';

export interface Product {
    id: number;
    image: string;
    images?: string[];
    title: string;
    price: string;
    priceValue: number;
    date: string;
    description?: string;
    platformLink?: string;
    category?: string;
    limit?: string | null;
    addOns?: AddOn[];
}

export interface AddOn {
    id: number;
    title: string;
    price: string;
}

class ProductService {
    private endpoint = '/products';

    // Get all products
    async getAll(): Promise<Product[]> {
        try {
            const response = await axiosInstance.get<Product[]>(this.endpoint);
            return response.data;
        } catch (error) {
            // Fallback to localStorage if API fails
            const saved = localStorage.getItem('admin_products');
            return saved ? JSON.parse(saved) : [];
        }
    }

    // Get product by ID
    async getById(id: number): Promise<Product | null> {
        try {
            const response = await axiosInstance.get<Product>(`${this.endpoint}/${id}`);
            return response.data;
        } catch (error) {
            // Fallback to localStorage
            const saved = localStorage.getItem('admin_products');
            if (saved) {
                const products: Product[] = JSON.parse(saved);
                return products.find(p => p.id === id) || null;
            }
            return null;
        }
    }

    // Create new product
    async create(product: Omit<Product, 'id'>): Promise<Product> {
        try {
            const response = await axiosInstance.post<Product>(this.endpoint, product);
            return response.data;
        } catch (error) {
            // Fallback to localStorage
            const newProduct = { ...product, id: Date.now() };
            const saved = localStorage.getItem('admin_products');
            const products = saved ? JSON.parse(saved) : [];
            products.push(newProduct);
            localStorage.setItem('admin_products', JSON.stringify(products));
            return newProduct as Product;
        }
    }

    // Update product
    async update(id: number, product: Partial<Product>): Promise<Product> {
        try {
            const response = await axiosInstance.put<Product>(`${this.endpoint}/${id}`, product);
            return response.data;
        } catch (error) {
            // Fallback to localStorage
            const saved = localStorage.getItem('admin_products');
            if (saved) {
                const products: Product[] = JSON.parse(saved);
                const index = products.findIndex(p => p.id === id);
                if (index !== -1) {
                    products[index] = { ...products[index], ...product };
                    localStorage.setItem('admin_products', JSON.stringify(products));
                    return products[index];
                }
            }
            throw new Error('Product not found');
        }
    }

    // Delete product
    async delete(id: number): Promise<void> {
        try {
            await axiosInstance.delete(`${this.endpoint}/${id}`);
        } catch (error) {
            // Fallback to localStorage
            const saved = localStorage.getItem('admin_products');
            if (saved) {
                const products: Product[] = JSON.parse(saved);
                const filtered = products.filter(p => p.id !== id);
                localStorage.setItem('admin_products', JSON.stringify(filtered));
            }
        }
    }
}

export default new ProductService();
