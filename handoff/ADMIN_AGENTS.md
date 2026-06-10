# Unapologetic Admin Dashboard

This is the **admin dashboard** for Unapologetic. It is a **separate project** from the customer storefront.

## Architecture

- **Storefront** (another repo): customers shop, checkout, account. Reads published catalog only.
- **This project**: staff manage collections, products, orders, promos. Writes catalog via `/admin/*` APIs.
- **Backend API**: single source of truth. Spec in `docs/backend-api-spec.json` (copy from storefront `docs/frontend-api-spec.json`).

Paystack and payment keys live on the **backend only**. This admin app never touches Paystack.

## Catalog: what the storefront expects

Read these files first (copy from storefront `handoff/`):

| File | Contents |
|------|----------|
| `docs/catalog-snapshot.json` | All 7 collections + 38 products (index, examples, variant shape) |
| `docs/catalog-field-mapping.md` | How admin API fields map to storefront UI and checkout |
| `docs/storefront-catalog-types.ts` | TypeScript types from storefront mock catalog |

Storefront source of truth (reference only): `lib/data/catalog.ts`, `lib/products.ts` in the storefront repo.

Admin publishes products the storefront can render on:

- Collection grids (`/collections/{id}`)
- Product detail (variants, sizes, stock, images)
- Quick Add modal (variant + size)
- Checkout line items: `{ productId, variantId, size, quantity }`

## API contract

Read `docs/backend-api-spec.json`:

- `projects.adminDashboard` — what this app consumes
- `requests` → group **Admin** — all endpoints
- `schemas` — Collection, Product, ProductInput, Order

Base URL: `NEXT_PUBLIC_API_URL` (e.g. `http://localhost:8000/v1`)

### Admin endpoints (summary)

| Area | Methods |
|------|---------|
| Collections | GET/POST `/admin/collections`, PATCH/DELETE `/admin/collections/:id` |
| Products | GET/POST `/admin/products`, PATCH/DELETE `/admin/products/:id` |
| Uploads | POST `/admin/uploads` (multipart → returns image URL string) |
| Orders | GET `/admin/orders`, PATCH `/admin/orders/:id` (status, tracking number) |

Auth: `auth: "admin"` on all admin routes. Implement admin login against backend when available.

## Environment

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/v1
```

No Paystack keys in this project.

## UI reference (storefront prototype)

The storefront repo has a **mock** admin UI for layout reference only:

- Black sidebar (`bg-black`), white logo, nav: Dashboard, Collections, Products
- Content area: `bg-zinc-50`, white cards with `border-zinc-200`
- Forms: `bg-zinc-50 border border-zinc-200`, sharp corners (no heavy rounding on cards)
- Typography: eyebrow labels (`text-[0.6rem] tracking-widest uppercase`)

Paths in storefront repo: `app/admin/**`, `lib/stores/admin-store.ts`

Replace all Zustand/localStorage with real API calls.

## Catalog rules

- Collections and products are **fully dynamic**. No hardcoded catalog in admin.
- Product images are **URL strings** from upload endpoint or CDN. No local file paths in API payloads.
- Variants: color (name, hex), `imageUrls[]`, sizes with stock per size.
- Currency: GHS. Prices are whole numbers (280 = ₵280).

## Orders (admin)

- List orders with filters (status, pagination)
- Update status: processing → shipped → in_transit → out_for_delivery → delivered
- Assign `trackingNumber` when shipping (public tracking uses `GET /tracking/:trackingNumber`)

## Shipping context (for order review, calculated on backend)

| Zone | Fee |
|------|-----|
| Accra | ₵30 |
| Ghana outside Accra | ₵80 |
| Outside Ghana | TBD (products only, `shippingStatus: pending_quote`) |

Admin does not calculate shipping at checkout. Backend does on `POST /orders`.

## Design system (match storefront)

- Light mode admin workspace: white/zinc palette
- Primary actions: black button (`bg-black text-white`, hover invert)
- Secondary: `border-zinc-200 text-zinc-600`
- No em dashes in UI copy
- Structural width: `max-w-360 mx-auto` where applicable

## Build checklist

1. Admin auth + protected routes
2. Collections CRUD wired to API
3. Products CRUD with variants, sizes, stock, image URLs
4. Image upload → save returned URL on product/collection
5. Orders list + status updates + tracking assignment
6. Promo code CRUD (spec TODO — storefront uses `POST /promo/validate` only)

## Next.js

Read `node_modules/next/dist/docs/` before writing code. This project may use a different Next.js version than your training data.

Run `npm run build` after changes before marking work complete.
