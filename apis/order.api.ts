import { api } from "./api";

export const orderApi = {
  createOrder: (data: any) => {
    return api.post("/orders", data);
  },
  getMyOrders: () => {
    return api.get("/orders/my-orders");
  },
  getOrder: (id: string) => {
    return api.get(`/orders/${id}`);
  },
};
