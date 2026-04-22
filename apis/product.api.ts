import { api } from "./api";

export const productApi = {
  createProduct: async (formData: FormData) => {
    const response = await api.post("/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  getProductBySlug: async (slug: string) => {
    const response = await api.get(`/products/${slug}`);
    return response.data;
  },
};
