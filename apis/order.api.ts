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
  getAdminOrders: (params: any) => {
    return api.get("/orders/admin", { params });
  },
  getAdminOrderDetail: (id: string) => {
    return api.get(`/orders/admin/${id}`);
  },
  getAdminOrderByCode: (orderCode: string) => {
    return api.get(`/orders/admin/code/${orderCode}`);
  },
  updateOrderStatus: (id: string, status: string) => {
    return api.patch(`/orders/${id}/status`, { status });
  },
};
