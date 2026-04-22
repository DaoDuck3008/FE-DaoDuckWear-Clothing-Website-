export interface CartItem {
  variantId: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  color: string;
  size: string;
  quantity: number;
  slug: string;
  dbId?: string; // ID từ database
}
