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
  image?: string; // API returns single image string (base64 or url)
  images: string[]; // Keep for compatibility if we want to wrap it
  category: string; // API returns category name directly
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
const normalizeArray = (value: any): any[] => (Array.isArray(value) ? value : []);

const mapToProduct = (item: any): Product => ({
  id: String(item.id),
  name: item.name,
  description: item.description || "",
  price: Number(item.price),
  link_product: item.link_product || "",
  image: item.image || (Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : undefined),
  images: Array.isArray(item.images) && item.images.length > 0
    ? item.images
    : (item.image ? [item.image] : []),
  category: item.category || "Uncategorized",
  category_id: item.category_id ? Number(item.category_id) : undefined,
  stock: item.stock,
  add_ons: normalizeArray(item.add_ons).map((addon: any) => ({
    id: String(addon.id),
    name: addon.name,
    price: Number(addon.price),
    link_add_ons: addon.link_add_ons,
  })),
});

/* =======================
   PRODUCT SERVICE
======================= */
class ProductService {
  private endpoint = "/product";

  // Ambil semua produk
  async getAll(): Promise<Product[]> {
    const response = await axiosInstance.get(this.endpoint);
    const rawList = normalizeArray(response.data?.data ?? response.data);

    return rawList.map(mapToProduct);
  }

  // Ambil produk by ID
  async getById(id: string): Promise<Product> {
    const response = await axiosInstance.get(`${this.endpoint}/${id}`);
    const item = response.data?.data ?? response.data;

    return mapToProduct(item);
  }

  // Ambil semua produk dengan nama kategori
  async getAllWithCategory(): Promise<ProductWithCategory[]> {
    const products = await this.getAll();


    return products.map(p => ({
      ...p,
      category_name: p.category || "Unknown",
    }));
  }

  // Ambil produk paginated
  async getPaginated(
    page = 1,
    limit = 10,
    search?: string,
    category_id?: number
  ) {
    const params: any = { page, limit };
    if (search?.trim()) params.search = search;
    if (category_id !== undefined) params.category_id = category_id;

    const response = await axiosInstance.get(this.endpoint, { params });
    const resData = response.data ?? {};
    const list =
      Array.isArray(resData.data)
        ? resData.data
        : Array.isArray(resData.data?.data)
          ? resData.data.data
          : [];
    const total = resData.total ?? resData.data?.total ?? list.length;

    return {
      data: list.map(mapToProduct),
      total: Number(total),
      page,
      limit,
    };
  }

  async create(product: ProductPayload) {
    const payload: any = {
      name: product.name,
      description: product.description,
      price: product.price,
      link_product: product.link_product,
      category_id: product.category_id,
    };
    if (product.stock !== undefined) payload.stock = product.stock;
    if (product.add_ons?.length) {
      payload.add_ons = product.add_ons.map((addon) => ({
        name: addon.name,
        price: addon.price,
        link_add_ons: addon.link_add_ons || "",
      }));
    }
    return axiosInstance.post(this.endpoint, payload);
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

// Ambil gambar produk
export const getProductImage = async (id: string): Promise<string | null> => {
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
