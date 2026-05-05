import { api } from "./api";

export const inventoryApi = {
  getInventory: async (params: {
    search?: string;
    categoryId?: string;
    page?: number;
    limit?: number;
    sort?: string;
    shopId?: string;
  }) => {
    const res = await api.get("/inventory", { params });
    return res.data;
  },

  getProductInventory: async (slug: string, shopId?: string) => {
    const res = await api.get(`/inventory/${slug}`, { params: { shopId } });
    return res.data;
  },

  updateInventory: async (data: {
    productId: string;
    variantId: string;
    quantity: number;
    shopId?: string;
  }) => {
    const res = await api.post("/inventory", data);
    return res.data;
  },
};
