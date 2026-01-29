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
  image?: string;
  images: string[];
  category: string;
  category_id?: number;
  stock?: number;
  add_ons?: AddOn[];
}

export interface ProductWithCategory extends Product {
  category_name: string;
}

export interface ProductPayload {
  name: string;
  description: string;
  price: number;
  link_product: string;
  category_id: number;
  stock?: number;
  add_ons?: AddOn[];
}

/* =======================
   NORMALIZER
======================= */
const normalizeArray = (value: any): any[] =>
  Array.isArray(value) ? value : [];

const mapToProduct = (item: any): Product => {
  // optional mapping category name → id (sesuaikan backend)
  const categoryMap: Record<string, number> = {
    Course: 1,
    Kelas: 2,
  };

  return {
    id: item.id ? String(item.id) : undefined,
    name: item.name ?? "",
    description: item.description ?? "",
    price: Number(item.price ?? item.Price ?? 0),
    link_product:
      item.link_product ??
      item.linkProduct ??
      item.LinkProduct ??
      item.link ??
      item.url ??
      item.redirect_url ??
      item.RedirectUrl ??
      "",

    image:
      item.image ||
      (Array.isArray(item.images) && item.images.length > 0
        ? item.images[0]
        : undefined),

    images: Array.isArray(item.images)
      ? item.images
      : item.image
        ? [item.image]
        : [],

    category: item.category ?? "Uncategorized",

    // 🔥 FIX CATEGORY ID
    category_id:
      item.category_id ??
      categoryMap[item.category] ??
      undefined,

    // 🔥 FIX STOCK
    stock: Number(item.stock ?? item.stok ?? 0),

    // 🔥 FIX ADD-ONS (semua kemungkinan nama)
    add_ons: normalizeArray(
      item.add_ons ?? item.addons ?? item.addOns
    ).map((addon: any) => ({
      id: addon.id ? String(addon.id) : undefined,
      name: addon.name ?? "",
      price: Number(addon.price ?? 0),
      link_add_ons: addon.link_add_ons ?? "",
    })),
  };
};

/* =======================
   PRODUCT SERVICE
======================= */
class ProductService {
  private endpoint = "/product";

  async getAll(): Promise<Product[]> {
    const response = await axiosInstance.get(this.endpoint);
    const rawList = normalizeArray(response.data?.data ?? response.data);
    return rawList.map(mapToProduct);
  }

  async getById(id: string): Promise<Product> {
    const response = await axiosInstance.get(`${this.endpoint}/${id}`);
    const item = response.data?.data ?? response.data;
    return mapToProduct(item);
  }

  async getAllWithCategory(): Promise<ProductWithCategory[]> {
    const products = await this.getAll();
    return products.map((p) => ({
      ...p,
      category_name: p.category || "Unknown",
    }));
  }

async getPaginated(
  page = 1,
  limit = 10,
  search?: string,
  category_id?: number,
  sortBy?: string,
  order?: 'asc' | 'desc'
) {
  const params: any = { page, limit };
  if (search?.trim()) params.search = search;
  if (category_id !== undefined) params.category_id = category_id;
  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order || 'asc';
  }

  const response = await axiosInstance.get(this.endpoint, { params });
  const resData = response.data ?? {};

  const list = Array.isArray(resData.data) ? resData.data : [];

  const meta = resData.meta ?? {};

  return {
    data: list.map(mapToProduct),

    // 🔥 AMBIL LANGSUNG DARI BACKEND
    total: Number(meta.totalData ?? list.length),
    totalPages: Number(meta.totalPage ?? 1),
    page: Number(meta.page ?? page),
    limit: Number(meta.limit ?? limit),
  };
}



  async update(id: string, product: Partial<Product>) {
    return axiosInstance.put(`${this.endpoint}/${id}`, product);
  }

  async delete(id: string) {
    return axiosInstance.delete(`${this.endpoint}/${id}`);
  }
}

/* =======================
   IMAGE SERVICE
======================= */
class ImageProductService {
  private endpoint = "/images";

  async upload(productId: string, images: string[]) {
    return axiosInstance.post(this.endpoint, {
      product_id: productId,
      image_url: images,
    });
  }
}

export const getProductImage = async (
  id: string
): Promise<string | null> => {
  try {
    const response = await axiosInstance.get(`/product/${id}`);
    const data = response.data?.data ?? response.data;
    if (!data.image) return null;

    return data.image.startsWith("http")
      ? data.image
      : `https://example.com/uploads/${data.image}`;
  } catch (error) {
    console.error(`Error fetching image for product ${id}:`, error);
    return null;
  }
};

export const productService = new ProductService();
export const imageProductService = new ImageProductService();
export default productService;
