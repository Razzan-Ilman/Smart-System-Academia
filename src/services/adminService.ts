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
    create: async (data: Partial<Product>) => {
        // Transform to PascalCase for backend
        const payload: any = {
            Name: data.name,
            Description: data.description || "",
            Price: data.price,
            LinkProduct: data.link_product,
            Images: data.images || [],
            CategoryId: data.category_id,
            Stock: data.stock || 0,
            AddOns: data.add_ons?.map(addon => ({
                Name: addon.name,
                Price: addon.price,
                LinkAddOns: addon.link_add_ons || ""
            })) || []
        };

        console.log('--- API REQUEST DEBUG ---');
        console.log('Method: POST');
        console.log('URL: /product');
        console.log('Payload (PascalCase):', JSON.stringify(payload, null, 2));

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

        // Include add_ons if present (for batch update attempt if backend supports it)
        if (data.add_ons) {
            payload.add_ons = data.add_ons.map(addon => ({
                name: addon.name,
                price: addon.price,
                link_add_ons: addon.link_add_ons
            }));
        }

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
        // Backend expects snake_case with product_id and add_ons array
        const finalPayload = {
            product_id: productId,
            add_ons: [
                {
                    name: data.name,
                    price: data.price,
                    link_add_ons: data.link_add_ons
                }
            ]
        };

        const response = await axiosInstance.post(`/addons`, finalPayload);
        return response.data;
    },

    // Update add-on
    update: async (addOnId: string, data: Partial<AddOn>) => {
        // Postman "Update Addons By Id"
        // URL: {{local_url}}/addons/:id
        // Body: { name, price, link_add_ons }
        const payload: any = {};
        if (data.name) payload.name = data.name;
        if (data.price) payload.price = data.price;
        if (data.link_add_ons) payload.link_add_ons = data.link_add_ons;

        const response = await axiosInstance.put(`/addons/${addOnId}`, payload);
        return response.data;
    },

    // Delete add-on
    delete: async (addOnId: string) => {
        // Postman "Delete Add Ons"
        // URL: {{local_url}}/addons/:id
        const response = await axiosInstance.delete(`/addons/${addOnId}`);
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
        // Backend only expects 'name' field
        const payload = {
            name: data.name
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

        // Store access token (backend returns accessToken in camelCase)
        const token = data?.data?.accessToken || data?.accessToken || data?.access_token || data?.data?.access_token || data?.token || data?.data?.token;
        if (token) {
            localStorage.setItem('admin_token', token);
        }

        // Store refresh token (backend returns refreshToken in camelCase)
        const refreshToken = data?.data?.refreshToken || data?.refreshToken || data?.refresh_token || data?.data?.refresh_token;
        if (refreshToken) {
            localStorage.setItem('refresh_token', refreshToken);
        }

        return response.data;
    },

    // Refresh Token
    refreshToken: async () => {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await axiosInstance.put('/user/refresh-token', {
            refreshToken: refreshToken
        });

        const data = response.data;
        // Backend returns accessToken and refreshToken in camelCase
        const newAccessToken = data?.data?.accessToken || data?.accessToken || data?.access_token || data?.data?.access_token;
        const newRefreshToken = data?.data?.refreshToken || data?.refreshToken || data?.refresh_token || data?.data?.refresh_token;

        if (newAccessToken) {
            localStorage.setItem('admin_token', newAccessToken);
        }

        if (newRefreshToken) {
            localStorage.setItem('refresh_token', newRefreshToken);
        }

        return newAccessToken;
    },

    // Register
    register: async (data: { email: string; name: string; username: string; password: string; confirmPassword: string; role: string }) => {
        // Match exact backend API schema
        const payload = {
            email: data.email,
            name: data.name,
            username: data.username,
            password: data.password,
            confirmPassword: data.confirmPassword,
            role: data.role
        };

        const response = await axiosInstance.post('/user/register', payload);
        return response.data;
    },

    // Logout
    logout: () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('admin_token');
    },

    // Get user data
    getUserData: () => {
        const userData = localStorage.getItem('user_data');
        return userData ? JSON.parse(userData) : null;
    },

    // Clear user data
    clearUserData: () => {
        localStorage.removeItem('user_data');
    },
};

// Image API Services
export const imageService = {
    // Upload images for a product
    uploadImages: async (productId: string, imageUrls: string[]) => {
        const payload = {
            product_id: productId,
            image_url: imageUrls
        };
        const response = await axiosInstance.post('/image', payload);
        return response.data;
    },
};

// Transaction API Services
export const transactionService = {
    // Get all transactions
    getAll: async () => {
        const response = await axiosInstance.get('/transaksi');
        return response.data;
    },

    // Get transaction by ID
    getById: async (id: string) => {
        const response = await axiosInstance.get(`/transaksi/${id}`);
        return response.data;
    },

    // Create new transaction
    create: async (data: {
        name: string;
        email: string;
        phone_number: string;
        payment_type: string;
        product_id: string;
        add_ons_ids?: string[];
    }) => {
        const response = await axiosInstance.post('/transaksi', data);
        return response.data;
    },

    // Confirm payment
    confirmPayment: async (id: string, originalReferenceNo: string) => {
        const response = await axiosInstance.put(
            `/transaksi/${id}/confirm-payment`,
            { originalReferenceNo }
        );
        return response.data;
    },
};

export default {
    product: productService,
    addOn: addOnService,
    category: categoryService,
    auth: authService,
    image: imageService,
    transaction: transactionService,
};
