import { api } from "./api";

export const inventoryApi = {
  getInventory: async (params: {
    search?: string;
    categoryId?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }) => {
    const res = await api.get("/inventory", { params });
    return res.data;
  },

  getProductInventory: async (slug: string) => {
    const res = await api.get(`/inventory/${slug}`);
    return res.data;
  },

  updateInventory: async (data: {
    productId: string;
    variantId: string;
    quantity: number;
  }) => {
    const res = await api.post("/inventory", data);
    return res.data;
  },
};
