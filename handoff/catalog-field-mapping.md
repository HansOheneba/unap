# Catalog: What the storefront expects vs what admin publishes

The customer storefront reads **published** catalog from the backend API. Today it uses mock data in the storefront repo. Admin must publish records that match this shape.

## Source files (storefront repo)

| File | Purpose |
|------|---------|
| `lib/data/catalog.ts` | Full mock catalog: 38 products, 7 collections |
| `lib/data/types.ts` | Raw catalog TypeScript types |
| `lib/products.ts` | Storefront layer: adds `variants[]` from colors/images |
| `handoff/catalog-snapshot.json` | Exported index + examples (copy to admin repo) |

Re-export snapshot after catalog changes:

```bash
npx tsx scripts/export-catalog-handoff.ts
```

## Collections (7)

| id | title | Products |
|----|-------|----------|
| underwear | The Second Skin | boxers, briefs, trunks |
| tops | The Anti-Uniform | shirts, polos, tanks |
| bottoms | Grounded Power | shorts, pants |
| tracksuits | Street Sovereign | track sets |
| active-wear | No Retreat | sports bras, leggings, etc. |
| sunglasses | The Eclipse Edit | eyewear |
| accessories | Bold Society | caps, beanies, socks |

See `catalog-snapshot.json` → `collections` for full metadata (subtitle, tagline, featured image).

## Admin API → storefront mapping

Backend **Product** schema (in `backend-api-spec.json`) is what the API returns. Storefront `lib/products.ts` maps catalog source into UI shape.

### API product (admin publishes)

```json
{
  "slug": "no-apology-boxer-brief",
  "name": "No Apology Boxer Brief",
  "price": 280,
  "collectionId": "underwear",
  "variants": [
    {
      "id": "midnight-black",
      "colorName": "Midnight Black",
      "colorHex": "#1a1a1a",
      "imageUrls": ["https://cdn.../boxer-black-1.jpg"],
      "sizes": [{ "size": "M", "stock": 15 }]
    }
  ]
}
```

### Storefront UI uses

- `category` = `collectionId` (e.g. `"underwear"`)
- `variants[].images` = API `imageUrls` (rename in API client)
- Cart line id: `{productId}__{variantId}__{size}`
- Quick Add / PDP: user picks variant + size before add

### Mock catalog source (admin forms today)

The prototype admin store uses a flatter shape from `lib/data/types.ts`:

- `images[]` — shared product images
- `colors[]` — `{ name, hex, image? }` per color
- `sizes[]` — string array (S, M, L…)

Backend should store **variants** (not flat colors). Admin UI can edit flat fields and merge into variants on save, or edit variants directly.

## Required fields per product

| Field | Required | Notes |
|-------|----------|-------|
| slug | yes | URL: `/collections/{collectionId}/{slug}` |
| name | yes | |
| description | yes | PDP + SEO |
| price | yes | GHS integer (280 = ₵280) |
| collectionId | yes | One of 7 collection ids |
| gender | yes | `male` or `female` |
| tag | yes | e.g. Essential, Signature |
| variants | yes | At least one color with images + sizes + stock |
| details | yes | Bullet list on PDP |
| careInstructions | yes | Bullet list on PDP |
| subcategory | no | e.g. boxers, caps |
| isActive | yes | Only active products on storefront |

## Images

- Storefront mock uses local paths: `/collections/boxers/...`
- Production: **URL strings** from `POST /admin/uploads` or CDN
- Each variant needs at least one image in `imageUrls[]`
- Collection `featuredImageUrl` for collection page hero

## Sizes and stock

| Category | Typical sizes |
|----------|----------------|
| Underwear (male) | S, M, L, XL |
| Tops / bottoms | S, M, L, XL, XXL |
| Female tops | XS, S, M, L, XL |
| Accessories | One Size |
| Sunglasses | One Size |

One-size products: storefront auto-selects size (no extra tap). See `getDefaultSelectedSize()` in `lib/products.ts`.

## Checkout line items

Storefront sends to `POST /orders`:

```json
{
  "productId": "no-apology-boxer-brief",
  "variantId": "midnight-black",
  "size": "M",
  "quantity": 1
}
```

`productId` = product slug/id. `variantId` = variant id from catalog.

## What admin must guarantee

1. Every active product has variants with stock per size
2. Prices match what backend charges (storefront does not send price)
3. `collectionId` matches a real collection slug
4. Deactivating a product hides it from `GET /catalog` and search
5. Image URLs are absolute or CDN paths the storefront can render
