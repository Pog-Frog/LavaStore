import { User } from "../services/auth.service";

export interface OrderItemPayload {
  product_id: number;
  quantity: number;
  price: number;
}

export interface CreateOrderPayload {
  items: OrderItemPayload[];
}

export interface NestedProductInOrderItem {
  id: number;
  name: string;
  image_url?: string;
  price: string;
}

export interface BackendOrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: string;
  created_at: string;
  updated_at: string;
  product: NestedProductInOrderItem; 
}

export interface BackendOrder {
  id: number;
  user_id: number;
  total: string;
  status: string;
  created_at: string;
  updated_at: string;
  order_items: BackendOrderItem[]; 
  user?: User
}

export interface BackendResponse<T> {
  message: string;
  data: T;
}