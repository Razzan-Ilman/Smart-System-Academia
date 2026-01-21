import axiosInstance from './axiosInstance';

// TypeScript Interfaces
export interface Product {
    id?: string;
    name: string;
    description: string;
    price: number;
    link_product: string;
    images: string[];
    category_id: number;
    stock: number;
    add_ons?: AddOn[];
}

export interface AddOn {
    id?: string;
    name: string;
    price: number;
    link_add_ons: string;
}

export interface Category {
    id?: number;
    name: string;
    description?: string;
}

// Product API Services
export const productService = {
    // Get all products
    getAll: async () => {
        const response = await axiosInstance.get('/product');
        const list = response.data.data || response.data; // Handle { data: [...] } or [...]
        return list.map((item: any) => ({
            id: item.Id || item.id,
            name: item.Name || item.name,
            description: item.Description || item.description,
            price: item.Price || item.price,
            link_product: item.LinkProduct || item.link_product,
            images: item.Images || item.images,
            category_id: item.CategoryId || item.category_id,
            stock: item.Stock || item.stock,
            add_ons: item.AddOns?.map((addon: any) => ({
                id: addon.Id || addon.id,
                name: addon.Name || addon.name,
                price: addon.Price || addon.price,
                link_add_ons: addon.LinkAddOns || addon.link_add_ons
            }))
        }));
    },

    // Get single product by ID
    getById: async (id: string) => {
        const response = await axiosInstance.get(`/product/${id}`);
        // Transform response if necessary
        const data = response.data.data || response.data;
        return {
            id: data.Id || data.id,
            name: data.Name || data.name,
            description: data.Description || data.description,
            price: data.Price || data.price,
            link_product: data.LinkProduct || data.link_product,
            images: data.Images || data.images,
            category_id: data.CategoryId || data.category_id,
            stock: data.Stock || data.stock,
            add_ons: data.AddOns?.map((addon: any) => ({
                id: addon.Id || addon.id,
                name: addon.Name || addon.name,
                price: addon.Price || addon.price,
                link_add_ons: addon.LinkAddOns || addon.link_add_ons
            }))
        };
    },

    // Create new product
    create: async (data: Product) => {
        const payload = {
            name: data.name,
            description: data.description,
            price: data.price,
            link_product: data.link_product,
            images: data.images,
            category_id: data.category_id,
            stock: data.stock,
            add_ons: data.add_ons?.map(addon => ({
                name: addon.name,
                price: addon.price,
                link_add_ons: addon.link_add_ons
            }))
        };
        console.log('--- API REQUEST DEBUG ---');
        console.log('Method: POST');
        console.log('URL: /product');
        console.log('Payload:', payload);
        const response = await axiosInstance.post('/product', payload);
        return response.data;
    },

    // Update product
    update: async (id: string, data: Partial<Product>) => {
        // Construct payload with available fields
        const payload: any = {};
        if (data.name) payload.name = data.name;
        if (data.description) payload.description = data.description;
        if (data.price) payload.price = data.price;
        if (data.link_product) payload.link_product = data.link_product;
        if (data.images) payload.images = data.images;
        if (data.category_id) payload.category_id = data.category_id;
        if (data.stock) payload.stock = data.stock;

        const response = await axiosInstance.put(`/product/${id}`, payload);
        return response.data;
    },

    // Delete product
    delete: async (id: string) => {
        const response = await axiosInstance.delete(`/product/${id}`);
        return response.data;
    },
};

// Add-on API Services
export const addOnService = {
    // Get all add-ons for a product
    getByProductId: async (productId: string) => {
        const response = await axiosInstance.get(`/product/${productId}/add-ons`);
        const list = response.data.data || response.data;
        return list.map((addon: any) => ({
            id: addon.Id || addon.id,
            name: addon.Name || addon.name,
            price: addon.Price || addon.price,
            link_add_ons: addon.LinkAddOns || addon.link_add_ons
        }));
    },

    // Create new add-on
    create: async (productId: string, data: AddOn) => {
        const payload = {
            name: data.name,
            price: data.price,
            link_add_ons: data.link_add_ons
        };
        const response = await axiosInstance.post(`/product/${productId}/add-ons`, payload);
        return response.data;
    },

    // Update add-on
    update: async (productId: string, addOnId: string, data: Partial<AddOn>) => {
        const payload: any = {};
        if (data.name) payload.name = data.name;
        if (data.price) payload.price = data.price;
        if (data.link_add_ons) payload.link_add_ons = data.link_add_ons;

        const response = await axiosInstance.put(`/product/${productId}/add-ons/${addOnId}`, payload);
        return response.data;
    },

    // Delete add-on
    delete: async (productId: string, addOnId: string) => {
        const response = await axiosInstance.delete(`/product/${productId}/add-ons/${addOnId}`);
        return response.data;
    },
};

// Category API Services
export const categoryService = {
    // Get all categories
    getAll: async () => {
        const response = await axiosInstance.get('/category');
        const list = response.data.data || response.data;
        return list.map((item: any) => ({
            id: item.Id || item.id,
            name: item.Name || item.name,
            description: item.Description || item.description
        }));
    },

    // Get single category by ID
    getById: async (id: number) => {
        const response = await axiosInstance.get(`/category/${id}`);
        const data = response.data.data || response.data;
        return {
            id: data.Id || data.id,
            name: data.Name || data.name,
            description: data.Description || data.description
        };
    },

    // Create new category
    create: async (data: Category) => {
        const payload = {
            name: data.name,
            description: data.description
        };
        const response = await axiosInstance.post('/category', payload);
        return response.data;
    },

    // Update category
    update: async (id: number, data: Partial<Category>) => {
        const payload: any = {};
        if (data.name) payload.name = data.name;
        if (data.description) payload.description = data.description;

        const response = await axiosInstance.put(`/category/${id}`, payload);
        return response.data;
    },

    // Delete category
    delete: async (id: number) => {
        const response = await axiosInstance.delete(`/category/${id}`);
        return response.data;
    },
};

// Auth API Services
export const authService = {
    // Login
    login: async (email: string, password: string) => {
        // HYBRID PAYLOAD: Sending both camelCase and PascalCase to ensure backend reads it
        const payload = {
            email: email,
            password: password,
            Email: email,
            Password: password
        };
        const response = await axiosInstance.post('/user/login', payload);
        const data = response.data;
        const token = data?.access_token || data?.data?.access_token || data?.token || data?.data?.token;
        if (token) {
            localStorage.setItem('admin_token', token);
        }
        return response.data;
    },

    // Register
    register: async (data: { email: string; password: string; confirmPassword: string; username: string; role: string }) => {
        // STRATEGY: "Username-as-Name Kitchen Sink"
        // Problem: Postman fails with 'uni_users_name' duplicate error even with strict schema, implying hidden 'name' column collision (likely empty/null).
        // Solution: Force-feed the unique 'username' into all possible 'name' fields. 
        // If the backend reads ANY of these, it will get a unique value, avoiding the constraint violation.
        const payload = {
            email: data.email,
            username: data.username,
            password: data.password,
            confirmPassword: data.confirmPassword,
            role: data.role,

            // Potential keys for the 'name' column
            name: data.username,
            Name: data.username,
            fullname: data.username,
            fullName: data.username,
            full_name: data.username,
            nama: data.username,
            Nama: data.username
        };

        const response = await axiosInstance.post('/user/register', payload);
        return response.data;
    },

    // Logout
    logout: () => {
        localStorage.removeItem('admin_token');
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('admin_token');
    },
};

export default {
    product: productService,
    addOn: addOnService,
    category: categoryService,
    auth: authService,
};
