import axiosInstance from "./axiosInstance";

class ImageProductService {
  private endpoint = "/images";

  async upload(productId: string, images: string[]) {
    return axiosInstance.post(this.endpoint, {
      product_id: productId,
      image_url: images, // base64 atau URL
    });
  }
}

export const imageProductService = new ImageProductService();
export default imageProductService;
