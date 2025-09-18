export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
  rate: number;
  count: number;
  }
}

export interface ErrorDetails {
  message: string;
  code?: number;
  details?: string;
  action?: {
    label: string;
    handler: () => void;
  };
}