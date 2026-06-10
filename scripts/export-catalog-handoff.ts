/**
 * Exports catalog data for admin dashboard handoff.
 * Run: npx tsx scripts/export-catalog-handoff.ts
 */
import { writeFileSync } from "fs";
import { join } from "path";
import {
  CATALOG_PRODUCTS,
  COLLECTION_META,
  getCatalogApiResponse,
} from "../lib/data/catalog";
import { PRODUCTS } from "../lib/products";

const outDir = join(process.cwd(), "handoff");

const productIndex = CATALOG_PRODUCTS.map((p) => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  price: p.price,
  gender: p.gender,
  collectionId: p.collectionId,
  subcategory: p.subcategory ?? null,
  tag: p.tag,
  colorCount: p.colors?.length ?? 1,
  sizes: p.sizes ?? ["One Size"],
  imageCount: p.images.length,
}));

const storefrontExamples = PRODUCTS.slice(0, 3).map((p) => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  price: p.price,
  collectionId: p.collectionId,
  category: p.category,
  variants: p.variants.map((v) => ({
    id: v.id,
    colorName: v.colorName,
    colorHex: v.colorHex,
    images: v.images,
    sizes: v.sizes,
  })),
  details: p.details,
  careInstructions: p.careInstructions,
}));

const catalogSourceExamples = CATALOG_PRODUCTS.slice(0, 2).map((p) => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  description: p.description,
  price: p.price,
  gender: p.gender,
  collectionId: p.collectionId,
  tag: p.tag,
  images: p.images,
  colors: p.colors ?? null,
  sizes: p.sizes ?? ["One Size"],
  details: p.details,
  careInstructions: p.careInstructions,
}));

const snapshot = {
  exportedAt: new Date().toISOString(),
  note: "Storefront mock catalog. Admin API should publish data in API spec shape; storefront maps to variants as shown in storefrontExamples.",
  collections: COLLECTION_META.map((c) => ({
    id: c.id,
    slug: c.id,
    subtitle: c.subtitle,
    title: c.title,
    tagline: c.tagline,
    featuredImageUrl: c.featured,
    href: c.href,
    productCount: CATALOG_PRODUCTS.filter((p) => p.collectionId === c.id)
      .length,
  })),
  productIndex,
  totalProducts: CATALOG_PRODUCTS.length,
  catalogSourceExamples,
  storefrontExamples,
  apiEnvelopeShape: getCatalogApiResponse().meta,
};

writeFileSync(
  join(outDir, "catalog-snapshot.json"),
  JSON.stringify(snapshot, null, 2),
);
console.log(`Wrote handoff/catalog-snapshot.json (${productIndex.length} products)`);
