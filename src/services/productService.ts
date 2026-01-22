import axiosInstance from "./axiosInstance";

/* =======================
   TYPES
======================= */
export interface AddOn {
  id?: string;
  name: string;
  price: number;
  link_add_ons?: string;
}

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  link_product: string;
  images: string[];
  category_id: number;
  stock?: number;
  add_ons?: AddOn[];
}

/* =======================
   NORMALIZER (ANTI ERROR)
======================= */
const normalizeArray = (value: any): any[] => {
  if (Array.isArray(value)) return value;
  return [];
};

/* =======================
   PRODUCT SERVICE
======================= */
class ProductService {
  private endpoint = "/product";

  /* ---------- GET ALL ---------- */
  async getAll(): Promise<Product[]> {
    const response = await axiosInstance.get(this.endpoint);
    const rawList = normalizeArray(response.data?.data ?? response.data);
    
    return rawList.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: Number(item.price),
      link_product: item.link_product,
      images: normalizeArray(item.images),
      category_id: Number(item.category_id),
      stock: item.stock,
      add_ons: normalizeArray(item.add_ons).map((addon: any) => ({
        id: addon.id,
        name: addon.name,
        price: Number(addon.price),
        link_add_ons: addon.link_add_ons,
      })),
    }));
  }

  /* ---------- GET BY ID ---------- */
  async getById(id: string): Promise<Product> {
    const response = await axiosInstance.get(`${this.endpoint}/${id}`);
    const item = response.data?.data ?? response.data;
    
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: Number(item.price),
      link_product: item.link_product,
      images: normalizeArray(item.images),
      category_id: Number(item.category_id),
      stock: item.stock,
      add_ons: normalizeArray(item.add_ons).map((addon: any) => ({
        id: addon.id,
        name: addon.name,
        price: Number(addon.price),
        link_add_ons: addon.link_add_ons,
      })),
    };
  }

  /* ---------- CREATE - FIXED SESUAI API (snake_case) ---------- */
  async create(product: Product) {
    const payload: any = {
      name: product.name,
      description: product.description,
      price: product.price,
      link_product: product.link_product,
      images: product.images,
      category_id: product.category_id,
    };

    if (product.stock !== undefined && product.stock > 0) {
      payload.stock = product.stock;
    }

    // Add-ons OPTIONAL - hanya kirim jika ada
    if (product.add_ons && product.add_ons.length > 0) {
      payload.add_ons = product.add_ons.map(addon => ({
        name: addon.name,
        price: addon.price,
        link_add_ons: addon.link_add_ons || ""
      }));
    }

    console.log("FINAL PAYLOAD → BACKEND (snake_case)");
    console.log(JSON.stringify(payload, null, 2));

    return axiosInstance.post(this.endpoint, payload);
  }

  /* ---------- UPDATE ---------- */
  async update(id: string, product: Partial<Product>) {
    const payload: any = {};
    
    if (product.name) payload.name = product.name;
    if (product.description) payload.description = product.description;
    if (product.price !== undefined) payload.price = product.price;
    if (product.link_product) payload.link_product = product.link_product;
    if (product.images) payload.images = product.images;
    if (product.category_id) payload.category_id = product.category_id;
    if (product.stock !== undefined) payload.stock = product.stock;

    return axiosInstance.put(`${this.endpoint}/${id}`, payload);
  }

  /* ---------- DELETE ---------- */
  async delete(id: string) {
    return axiosInstance.delete(`${this.endpoint}/${id}`);
  }
}

export const productService = new ProductService();
export default productService;