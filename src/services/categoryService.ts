import axiosInstance from "./axiosInstance";

// ✅ Export interface Category agar bisa di-import
export interface Category {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

class CategoryService {
  private endpoint = "/category";

  /**
   * Ambil semua kategori
   */
  async getAll(): Promise<Category[]> {
    try {
      const response = await axiosInstance.get(this.endpoint);
      const rawData = response.data?.data ?? response.data ?? [];
      // Pastikan semua id number
      return rawData.map((c: any) => ({
        id: Number(c.id),
        name: c.name,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }

  /**
   * Ambil kategori berdasarkan ID
   */
  async getById(id: number | string): Promise<Category | null> {
    const categories = await this.getAll();
    // Pastikan perbandingan id number
    const targetId = Number(id);
    return categories.find(cat => cat.id === targetId) ?? null;
  }
}

export const categoryService = new CategoryService();
export default categoryService;
