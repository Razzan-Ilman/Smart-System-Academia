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
  id?: string; // ✅ STRING (aman untuk routing & getById)
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
  return Array.isArray(value) ? value : [];
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
      id: String(item.id),
      name: item.name,
      description: item.description,
      price: Number(item.price),
      link_product: item.link_product,
      images: normalizeArray(item.images),
      category_id: Number(item.category_id),
      stock: item.stock,
      add_ons: normalizeArray(item.add_ons).map((addon: any) => ({
        id: String(addon.id),
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
      id: String(item.id),
      name: item.name,
      description: item.description,
      price: Number(item.price),
      link_product: item.link_product,
      images: normalizeArray(item.images),
      category_id: Number(item.category_id),
      stock: item.stock,
      add_ons: normalizeArray(item.add_ons).map((addon: any) => ({
        id: String(addon.id),
        name: addon.name,
        price: Number(addon.price),
        link_add_ons: addon.link_add_ons,
      })),
    };
  }

  /* ---------- GET PAGINATED ---------- */
async getPaginated(
  page = 1,
  limit = 10,
  search?: string,
  category_id?: number
) {
  const params: any = { page, limit };
  if (search?.trim()) params.search = search;
  if (category_id) params.category_id = category_id;

  const response = await axiosInstance.get(this.endpoint, { params });

  const resData = response.data ?? {};

  // 🔑 DETEKSI STRUKTUR
  const list =
    Array.isArray(resData.data)
      ? resData.data
      : Array.isArray(resData.data?.data)
      ? resData.data.data
      : [];

  const total =
    resData.total ??
    resData.data?.total ??
    list.length;

  return {
    data: list.map((item: any) => ({
      id: String(item.id),
      name: item.name,
      description: item.description,
      price: Number(item.price),
      link_product: item.link_product,
      images: Array.isArray(item.images) ? item.images : [],
      category_id: Number(item.category_id),
      stock: item.stock,
      add_ons: Array.isArray(item.add_ons)
        ? item.add_ons.map((a: any) => ({
            id: String(a.id),
            name: a.name,
            price: Number(a.price),
            link_add_ons: a.link_add_ons,
          }))
        : [],
    })),
    total: Number(total),
    page,
    limit,
  };
}


  /* ---------- CREATE ---------- */
  async create(product: Product) {
    const payload: any = {
      name: product.name,
      description: product.description,
      price: product.price,
      link_product: product.link_product,
      images: product.images,
      category_id: product.category_id,
    };

    if (product.stock !== undefined) payload.stock = product.stock;

    if (product.add_ons?.length) {
      payload.add_ons = product.add_ons.map(addon => ({
        name: addon.name,
        price: addon.price,
        link_add_ons: addon.link_add_ons || "",
      }));
    }

    return axiosInstance.post(this.endpoint, payload);
  }

  /* ---------- UPDATE ---------- */
  async update(id: string, product: Partial<Product>) {
    return axiosInstance.put(`${this.endpoint}/${id}`, product);
  }

  /* ---------- DELETE ---------- */
  async delete(id: string) {
    return axiosInstance.delete(`${this.endpoint}/${id}`);
  }
}

/* =======================
   EXPORT
======================= */
export const productService = new ProductService();
export default productService;
