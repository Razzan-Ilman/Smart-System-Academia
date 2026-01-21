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
    stock?: number;
    addOns?: AddOn[];
}

export interface AddOn {
    id: number;
    title: string;
    price: string;
}

class ProductService {
    private endpoint = '/product';

    // Get all products
    async getAll(): Promise<Product[]> {
        try {
            const response = await axiosInstance.get<Product[]>(this.endpoint);
            const list: any = response.data || [];
            const rawList = list.data || list;
            return rawList.map((item: any) => ({
                id: item.Id || item.id,
                title: item.Name || item.name || item.title, // Map Name to title as per interface
                image: (item.Images && item.Images.length > 0) ? item.Images[0] : ((item.images && item.images.length > 0) ? item.images[0] : ''),
                price: typeof item.Price === 'string' ? item.Price : (item.Price?.toString() || item.price?.toString()),
                priceValue: item.Price || item.price || item.priceValue,
                date: item.Date || item.date || new Date().toISOString(),
                description: item.Description || item.description,
                platformLink: item.LinkProduct || item.link_product || item.platformLink,
                images: item.Images || item.images,
                category: item.CategoryId || item.category, // Might need mapping if interface expects string name
                stock: item.Stock || item.stock,
                addOns: item.AddOns?.map((addon: any) => ({
                    id: addon.Id || addon.id,
                    title: addon.Name || addon.name || addon.title,
                    price: addon.Price?.toString() || addon.price?.toString()
                }))
            }));
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
            const data: any = response.data;
            const item = data.data || data;

            return {
                id: item.Id || item.id,
                title: item.Name || item.name || item.title,
                image: (item.Images && item.Images.length > 0) ? item.Images[0] : ((item.images && item.images.length > 0) ? item.images[0] : ''),
                price: typeof item.Price === 'string' ? item.Price : (item.Price?.toString() || item.price?.toString()),
                priceValue: item.Price || item.price || item.priceValue,
                date: item.Date || item.date || new Date().toISOString(),
                description: item.Description || item.description,
                platformLink: item.LinkProduct || item.link_product || item.platformLink,
                images: item.Images || item.images,
                category: item.CategoryId || item.category,
                stock: item.Stock || item.stock,
                addOns: item.AddOns?.map((addon: any) => ({
                    id: addon.Id || addon.id,
                    title: addon.Name || addon.name || addon.title,
                    price: addon.Price?.toString() || addon.price?.toString()
                }))
            };
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
            const payload = {
                name: product.title,
                price: product.priceValue,
                description: product.description,
                link_product: product.platformLink,
                images: product.images,
                category_id: product.category, // Caution: this might need ID parsing if it's a string name
                add_ons: product.addOns?.map(addon => ({
                    name: addon.title,
                    price: parseInt(addon.price)
                }))
            };
            const response = await axiosInstance.post<Product>(this.endpoint, payload);
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
            const payload: any = {};
            if (product.title) payload.name = product.title;
            if (product.priceValue) payload.price = product.priceValue;
            if (product.description) payload.description = product.description;
            // Add other fields as necessary

            const response = await axiosInstance.put<Product>(`${this.endpoint}/${id}`, payload);
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
