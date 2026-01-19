import axiosInstance from './axiosInstance';

export interface Category {
    id: number;
    name: string;
    date: string;
}

class CategoryService {
    private endpoint = '/categories';

    // Get all categories
    async getAll(): Promise<Category[]> {
        try {
            const response = await axiosInstance.get<Category[]>(this.endpoint);
            return response.data;
        } catch (error) {
            // Fallback to localStorage
            const saved = localStorage.getItem('admin_categories');
            return saved ? JSON.parse(saved) : [];
        }
    }

    // Get category by ID
    async getById(id: number): Promise<Category | null> {
        try {
            const response = await axiosInstance.get<Category>(`${this.endpoint}/${id}`);
            return response.data;
        } catch (error) {
            // Fallback to localStorage
            const saved = localStorage.getItem('admin_categories');
            if (saved) {
                const categories: Category[] = JSON.parse(saved);
                return categories.find(c => c.id === id) || null;
            }
            return null;
        }
    }

    // Create new category
    async create(category: Omit<Category, 'id'>): Promise<Category> {
        try {
            const response = await axiosInstance.post<Category>(this.endpoint, category);
            return response.data;
        } catch (error) {
            // Fallback to localStorage
            const newCategory = { ...category, id: Date.now() };
            const saved = localStorage.getItem('admin_categories');
            const categories = saved ? JSON.parse(saved) : [];
            categories.push(newCategory);
            localStorage.setItem('admin_categories', JSON.stringify(categories));
            return newCategory as Category;
        }
    }

    // Update category
    async update(id: number, category: Partial<Category>): Promise<Category> {
        try {
            const response = await axiosInstance.put<Category>(`${this.endpoint}/${id}`, category);
            return response.data;
        } catch (error) {
            // Fallback to localStorage
            const saved = localStorage.getItem('admin_categories');
            if (saved) {
                const categories: Category[] = JSON.parse(saved);
                const index = categories.findIndex(c => c.id === id);
                if (index !== -1) {
                    categories[index] = { ...categories[index], ...category };
                    localStorage.setItem('admin_categories', JSON.stringify(categories));
                    return categories[index];
                }
            }
            throw new Error('Category not found');
        }
    }

    // Delete category
    async delete(id: number): Promise<void> {
        try {
            await axiosInstance.delete(`${this.endpoint}/${id}`);
        } catch (error) {
            // Fallback to localStorage
            const saved = localStorage.getItem('admin_categories');
            if (saved) {
                const categories: Category[] = JSON.parse(saved);
                const filtered = categories.filter(c => c.id !== id);
                localStorage.setItem('admin_categories', JSON.stringify(filtered));
            }
        }
    }
}

export default new CategoryService();
