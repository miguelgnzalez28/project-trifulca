
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  images: string[];
  options: {
    sizes: string[];
    versions: string[];
    sleeves: string[];
    patches: string[];
  };
}

export type View = 'home' | 'list' | 'detail';
