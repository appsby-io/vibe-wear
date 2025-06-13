export interface CartItem {
  id: string;
  designId: string;
  designName: string;
  designImageUrl: string;
  hdImageUrl?: string;
  product: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  prompt?: string;
  revisedPrompt?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CheckoutForm {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  sameAsBilling: boolean;
}

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}