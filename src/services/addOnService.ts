import axiosInstance from "./axiosInstance";

export interface AddOn {
    id?: string;
    name: string;
    price: number;
    link_add_ons: string;
}

class AddOnService {
    private endpoint = "/addons";

    // Get all add-ons for a product
    async getByProductId(productId: string) {
        const response = await axiosInstance.get(`/product/${productId}/add-ons`);
        const list = response.data.data || response.data;
        return list.map((addon: any) => ({
            id: addon.Id || addon.id,
            name: addon.Name || addon.name,
            price: addon.Price || addon.price,
            link_add_ons: addon.LinkAddOns || addon.link_add_ons
        }));
    }

    // Create new add-on
    async create(productId: string, data: AddOn) {
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

        const response = await axiosInstance.post(this.endpoint, finalPayload);
        return response.data;
    }

    // Update add-on
    async update(addOnId: string, data: Partial<AddOn>) {
        const payload: any = {};
        if (data.name) payload.name = data.name;
        if (data.price) payload.price = data.price;
        if (data.link_add_ons) payload.link_add_ons = data.link_add_ons;

        const response = await axiosInstance.put(`${this.endpoint}/${addOnId}`, payload);
        return response.data;
    }

    // Delete add-on
    async delete(addOnId: string) {
        const response = await axiosInstance.delete(`${this.endpoint}/${addOnId}`);
        return response.data;
    }
}

export const addOnService = new AddOnService();
export default addOnService;
