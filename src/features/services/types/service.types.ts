export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  image_url?: string;
  category?: string;
  created_at?: string;
}
