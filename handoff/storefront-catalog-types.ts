/**
 * Copied from storefront lib/data/types.ts + lib/products.ts shapes.
 * Reference for admin dashboard: what the mock catalog uses today.
 * Production API uses variants[] per backend-api-spec.json (see catalog-field-mapping.md).
 */

export type Gender = "male" | "female";

export type ProductColor = {
  name: string;
  hex: string;
  image?: string;
};

export type SizeStock = {
  size: string;
  stock: number;
};

/** Storefront PDP / cart variant (from lib/products.ts) */
export type StorefrontColorVariant = {
  id: string;
  colorName: string;
  colorHex: string;
  images: string[];
  sizes: SizeStock[];
};

/** Mock catalog source record (lib/data/catalog.ts) */
export type CatalogSourceProduct = {
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

/** What collection pages and PDP consume after lib/products.ts mapping */
export type StorefrontProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  gender: Gender;
  category: string;
  collectionId: string;
  subcategory?: string;
  tag: string;
  variants: StorefrontColorVariant[];
  details: string[];
  careInstructions: string[];
};

export type CollectionMeta = {
  id: string;
  subtitle: string;
  title: string;
  tagline: string;
  featured: string;
  href: string;
};

/** Cart / order line item identifiers */
export type CartLineKey = {
  productId: string;
  variantId: string;
  size: string;
};
