import { productService, categoryService, addOnService } from './adminService';
import type { Product, Category, AddOn } from './adminService';

const USE_API = import.meta.env.VITE_USE_API === 'true';

// Helper untuk format harga
const formatPrice = (value: number) => {
    return `Rp ${value.toLocaleString('id-ID')}`;
};

// Product Service dengan fallback localStorage
export const productServiceWithFallback = {
    getAll: async (): Promise<Product[]> => {
        if (USE_API) {
            try {
                return await productService.getAll();
            } catch (error) {
                console.warn('API failed, using localStorage fallback');
            }
        }

        // Fallback to localStorage
        const saved = localStorage.getItem("admin_products");
        return saved ? JSON.parse(saved) : [];
    },

    getById: async (id: string): Promise<Product> => {
        if (USE_API) {
            try {
                return await productService.getById(id);
            } catch (error) {
                console.warn('API failed, using localStorage fallback');
            }
        }

        // Fallback to localStorage
        const saved = localStorage.getItem("admin_products");
        if (saved) {
            const products = JSON.parse(saved);
            const product = products.find((p: any) => p.id?.toString() === id);
            if (product) return product;
        }
        throw new Error('Product not found');
    },

    create: async (data: Omit<Product, 'id'>): Promise<Product> => {
        if (USE_API) {
            try {
                return await productService.create(data);
            } catch (error) {
                console.warn('API failed, using localStorage fallback');
            }
        }

        // Fallback to localStorage
        const saved = localStorage.getItem("admin_products");
        const products = saved ? JSON.parse(saved) : [];
        const newProduct = {
            id: Date.now().toString(),
            ...data,
            // For display purposes
            title: data.name,
            priceValue: data.price,
            image: data.images && data.images.length > 0 ? data.images[0] : "",
            date: new Date().toISOString().split('T')[0]
        };
        const updatedProducts = [...products, newProduct];
        localStorage.setItem("admin_products", JSON.stringify(updatedProducts));
        return newProduct;
    },

    update: async (id: string, data: Partial<Product>): Promise<Product> => {
        if (USE_API) {
            try {
                return await productService.update(id, data);
            } catch (error) {
                console.warn('API failed, using localStorage fallback');
            }
        }

        // Fallback to localStorage
        const saved = localStorage.getItem("admin_products");
        if (saved) {
            const products = JSON.parse(saved);
            const updatedProducts = products.map((p: any) => {
                if (p.id?.toString() === id) {
                    return {
                        ...p,
                        ...data,
                        title: data.name || p.title,
                        priceValue: data.price || p.priceValue,
                        image: data.images && data.images.length > 0 ? data.images[0] : p.image
                    };
                }
                return p;
            });
            localStorage.setItem("admin_products", JSON.stringify(updatedProducts));
            const updated = updatedProducts.find((p: any) => p.id?.toString() === id);
            if (updated) return updated;
        }
        throw new Error('Product not found');
    },

    delete: async (id: string): Promise<void> => {
        if (USE_API) {
            try {
                return await productService.delete(id);
            } catch (error) {
                console.warn('API failed, using localStorage fallback');
            }
        }

        // Fallback to localStorage
        const saved = localStorage.getItem("admin_products");
        if (saved) {
            const products = JSON.parse(saved);
            const updatedProducts = products.filter((p: any) => p.id?.toString() !== id);
            localStorage.setItem("admin_products", JSON.stringify(updatedProducts));
        }
    }
};

// Category Service dengan fallback localStorage
export const categoryServiceWithFallback = {
    getAll: async (): Promise<Category[]> => {
        if (USE_API) {
            try {
                return await categoryService.getAll();
            } catch (error) {
                console.warn('API failed, using localStorage fallback');
            }
        }

        // Fallback to localStorage
        const saved = localStorage.getItem("admin_categories");
        return saved ? JSON.parse(saved) : [
            { id: 1, name: "Course" },
            { id: 2, name: "Kelas" }
        ];
    },

    getById: async (id: number): Promise<Category> => {
        if (USE_API) {
            try {
                return await categoryService.getById(id);
            } catch (error) {
                console.warn('API failed, using localStorage fallback');
            }
        }

        // Fallback to localStorage
        const saved = localStorage.getItem("admin_categories");
        if (saved) {
            const categories = JSON.parse(saved);
            const category = categories.find((c: any) => c.id === id);
            if (category) return category;
        }
        throw new Error('Category not found');
    },

    create: async (data: Omit<Category, 'id'>): Promise<Category> => {
        if (USE_API) {
            try {
                return await categoryService.create(data);
            } catch (error) {
                console.warn('API failed, using localStorage fallback');
            }
        }

        // Fallback to localStorage
        const saved = localStorage.getItem("admin_categories");
        const categories = saved ? JSON.parse(saved) : [];
        const newCategory = {
            id: Date.now(),
            ...data
        };
        const updatedCategories = [...categories, newCategory];
        localStorage.setItem("admin_categories", JSON.stringify(updatedCategories));
        return newCategory;
    },

    update: async (id: number, data: Partial<Category>): Promise<Category> => {
        if (USE_API) {
            try {
                return await categoryService.update(id, data);
            } catch (error) {
                console.warn('API failed, using localStorage fallback');
            }
        }

        // Fallback to localStorage
        const saved = localStorage.getItem("admin_categories");
        if (saved) {
            const categories = JSON.parse(saved);
            const updatedCategories = categories.map((c: any) =>
                c.id === id ? { ...c, ...data } : c
            );
            localStorage.setItem("admin_categories", JSON.stringify(updatedCategories));
            const updated = updatedCategories.find((c: any) => c.id === id);
            if (updated) return updated;
        }
        throw new Error('Category not found');
    },

    delete: async (id: number): Promise<void> => {
        if (USE_API) {
            try {
                return await categoryService.delete(id);
            } catch (error) {
                console.warn('API failed, using localStorage fallback');
            }
        }

        // Fallback to localStorage
        const saved = localStorage.getItem("admin_categories");
        if (saved) {
            const categories = JSON.parse(saved);
            const updatedCategories = categories.filter((c: any) => c.id !== id);
            localStorage.setItem("admin_categories", JSON.stringify(updatedCategories));
        }
    }
};

export { USE_API };
