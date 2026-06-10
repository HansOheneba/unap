// ─────────────────────────────────────────────────────────────────────────────
// Storefront product layer — sourced from lib/data/catalog.ts (mock API).
// Swap fetchCatalog() for a real API call when the backend is ready.
// ─────────────────────────────────────────────────────────────────────────────

import {
  CATALOG_PRODUCTS,
  getProductBySlug as getCatalogProductBySlug,
} from "@/lib/data/catalog";
import type { Product as CatalogProduct } from "@/lib/data/types";

export type SizeStock = {
  size: string;
  stock: number;
};

/** Auto-select when a variant has only one size option. */
export function getDefaultSelectedSize(sizes: SizeStock[]): string | null {
  return sizes.length === 1 ? sizes[0].size : null;
}

export type ColorVariant = {
  id: string;
  colorName: string;
  colorHex: string;
  images: string[];
  sizes: SizeStock[];
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  date: string;
  body: string;
  verified: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  gender: CatalogProduct["gender"];
  category: string;
  subcategory?: string;
  tag: string;
  collectionId: string;
  variants: ColorVariant[];
  details: string[];
  careInstructions: string[];
  reviews?: Review[];
};

export const MOCK_REVIEWS: Review[] = [
  {
    id: "r1",
    author: "Kwame A.",
    rating: 5,
    date: "May 10, 2026",
    body: "Exceptional quality. Bought two and immediately ordered a third. The fit is perfect and the fabric feels premium.",
    verified: true,
  },
  {
    id: "r2",
    author: "Ama T.",
    rating: 5,
    date: "May 7, 2026",
    body: "Finally a brand that understands what confidence looks like in clothing. I get compliments every single time.",
    verified: true,
  },
  {
    id: "r3",
    author: "Nana O.",
    rating: 4,
    date: "Apr 30, 2026",
    body: "Really solid construction. Sizing runs slightly large so I'd suggest sizing down. Otherwise no complaints.",
    verified: true,
  },
  {
    id: "r4",
    author: "Efua M.",
    rating: 5,
    date: "Apr 22, 2026",
    body: "The attention to detail is unmatched. You can tell this was made by people who actually care.",
    verified: false,
  },
];

function defaultStock(sizes: string[]): SizeStock[] {
  return sizes.map((size, i) => ({
    size,
    stock: Math.max(4, 18 - i * 3),
  }));
}

function toVariants(catalog: CatalogProduct): ColorVariant[] {
  const sizes = catalog.sizes ?? ["One Size"];
  const images = catalog.images;

  if (catalog.colors && catalog.colors.length > 0) {
    return catalog.colors.map((color, i) => ({
      id: color.name.toLowerCase().replace(/\s+/g, "-"),
      colorName: color.name,
      colorHex: color.hex,
      images: color.image ? [color.image, ...images] : images,
      sizes: defaultStock(sizes),
    }));
  }

  return [
    {
      id: "default",
      colorName: "Default",
      colorHex: "#1a1a1a",
      images,
      sizes: defaultStock(sizes),
    },
  ];
}

function toStorefrontProduct(catalog: CatalogProduct): Product {
  return {
    id: catalog.id,
    slug: catalog.slug,
    name: catalog.name,
    description: catalog.description,
    price: catalog.price,
    gender: catalog.gender,
    category: catalog.collectionId,
    subcategory: catalog.subcategory,
    tag: catalog.tag,
    collectionId: catalog.collectionId,
    variants: toVariants(catalog),
    details: catalog.details,
    careInstructions: catalog.careInstructions,
    reviews: MOCK_REVIEWS.slice(0, 3),
  };
}

export const PRODUCTS: Product[] = CATALOG_PRODUCTS.map(toStorefrontProduct);

export function getProductBySlug(slug: string): Product | undefined {
  const catalog = getCatalogProductBySlug(slug);
  return catalog ? toStorefrontProduct(catalog) : undefined;
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return PRODUCTS.filter(
    (p) => p.category === product.category && p.slug !== product.slug,
  ).slice(0, limit);
}

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(PRODUCTS.map((p) => p.category)));
}
