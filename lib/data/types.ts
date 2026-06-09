export type Gender = "male" | "female";

export type AccessoryType = "socks" | "caps" | "beanies";

export type ProductColor = {
  name: string;
  hex: string;
  image?: string;
};

export type SizeStock = {
  size: string;
  stock: number;
};

export type ColorVariant = {
  id: string;
  colorName: string;
  colorHex: string;
  images: string[];
  sizes: SizeStock[];
};

/** Admin / search catalog product — mirrors a future API record */
export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  gender: Gender;
  collectionId: string;
  subcategory?: string;
  images: string[];
  colors?: ProductColor[];
  sizes?: string[];
  tag: string;
  details: string[];
  careInstructions: string[];
};

export type Collection = {
  id: string;
  subtitle: string;
  title: string;
  tagline: string;
  featured: string;
  href: string;
  products: Product[];
};

export type OverviewCard = {
  id: string;
  label: string;
  img: string;
  description: string;
};

/** Mock API envelope — swap the fetch target later */
export type CatalogApiResponse = {
  data: {
    collections: Collection[];
    products: Product[];
  };
  meta: {
    version: string;
    totalProducts: number;
    lastUpdated: string;
  };
};
