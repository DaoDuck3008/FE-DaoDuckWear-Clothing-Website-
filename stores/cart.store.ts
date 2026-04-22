"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "@/types/cart.type";
import { cartApi } from "@/apis/cart.api";
import { useAuthStore } from "./auth.store";

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  fetchCart: () => Promise<void>;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      fetchCart: async () => {
        const user = useAuthStore.getState().user;
        if (!user) return;

        try {
          const { data } = await cartApi.getCart();
          // Map DB items to Store items
          const mappedItems: CartItem[] = data.items.map((item: any) => {
            const variantColor = item.variant.color;
            // Tìm ảnh khớp với màu của variant, nếu không thấy thì lấy ảnh đầu tiên
            const variantImage = item.variant.product.images?.find(
              (img: any) => img.color === variantColor
            )?.url || item.variant.product.images?.[0]?.url || "";

            return {
              variantId: item.variantId,
              productId: item.variant.productId,
              name: item.variant.product.name,
              image: variantImage,
              price: Number(item.variant.price),
              color: variantColor,
              size: item.variant.size,
              quantity: item.quantity,
              slug: item.variant.product.slug,
              dbId: item.id,
            };
          });
          set({ items: mappedItems });
        } catch (error) {
          console.error("Failed to fetch cart:", error);
        }
      },

      addItem: async (newItem) => {
        const user = useAuthStore.getState().user;
        const currentItems = get().items;
        const existingItemIndex = currentItems.findIndex(
          (item) => item.variantId === newItem.variantId,
        );

        // Optimistic Update: Cập nhật UI trước
        let updatedItems = [...currentItems];
        if (existingItemIndex > -1) {
          updatedItems[existingItemIndex].quantity += newItem.quantity;
        } else {
          updatedItems = [newItem, ...currentItems];
        }
        set({ items: updatedItems });

        // Sync with Backend
        if (user) {
          try {
            await cartApi.addToCart(newItem.variantId, newItem.quantity);
            await get().fetchCart(); // Fetch lại để có dbId chính xác
          } catch (error) {
            console.error("Failed to add item to backend cart:", error);
            // Có thể rollback UI ở đây nếu cần
          }
        }
      },

      removeItem: async (variantId) => {
        const user = useAuthStore.getState().user;
        const itemToRemove = get().items.find(
          (item) => item.variantId === variantId,
        );

        // Optimistic Update
        set({
          items: get().items.filter((item) => item.variantId !== variantId),
        });

        // Sync with Backend
        if (user && itemToRemove?.dbId) {
          try {
            await cartApi.removeItem(itemToRemove.dbId);
          } catch (error) {
            console.error("Failed to remove item from backend:", error);
          }
        }
      },

      updateQuantity: async (variantId, quantity) => {
        if (quantity <= 0) {
          await get().removeItem(variantId);
          return;
        }

        const user = useAuthStore.getState().user;
        const itemToUpdate = get().items.find(
          (item) => item.variantId === variantId,
        );

        // Optimistic Update
        set({
          items: get().items.map((item) =>
            item.variantId === variantId ? { ...item, quantity } : item,
          ),
        });

        // Sync with Backend
        if (user && itemToUpdate?.dbId) {
          try {
            await cartApi.updateQuantity(itemToUpdate.dbId, quantity);
          } catch (error) {
            console.error("Failed to update quantity on backend:", error);
          }
        }
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      totalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },
    }),
    {
      name: "daoduck-cart-storage",
    },
  ),
);
