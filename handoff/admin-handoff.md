# Admin Dashboard Handoff (full context)

Transferred from the Unapologetic storefront project. Use with `ADMIN_AGENTS.md` and `docs/backend-api-spec.json`.

## Why a separate admin project

The storefront `/admin` routes are a **prototype** using local Zustand (`lib/stores/admin-store.ts`). They are not production admin. The real admin dashboard is its own app calling the same backend's `/admin/*` routes.

The storefront will **never** write to the catalog after the API is live. It only reads published data.

## What admin must build

### Phase 1 — CMS

- Login (admin role JWT/session from backend)
- Dashboard stats (product count, collection count, recent orders)
- Collections: create, edit, delete, sort order, featured image URL, active flag
- Products: full CRUD with variants (color, images, sizes, stock)
- Image upload: `POST /admin/uploads` → paste URL into forms

### Phase 2 — Operations

- Orders list with status filters
- Order detail: line items, shipping address, payment status
- Update order status and assign tracking number
- Promo code management (not in spec yet; add to backend + admin)

## Catalog snapshot (copy to admin repo)

`handoff/catalog-snapshot.json` includes:

- `collections` — all 7 with titles, taglines, featured images, product counts
- `productIndex` — all 38 products (id, slug, name, price, collection, sizes, colors)
- `catalogSourceExamples` — raw admin-style records from `lib/data/catalog.ts`
- `storefrontExamples` — how `lib/products.ts` exposes variants to the UI

`handoff/catalog-field-mapping.md` explains admin → API → storefront mapping.

Re-export after catalog edits: `npx tsx scripts/export-catalog-handoff.ts`

## Data shapes (from spec schemas)

**Collection:** id, slug, subtitle, title, tagline, featuredImageUrl, sortOrder, isActive

**Product:** slug, name, description, price, gender, collectionId, tag, details[], careInstructions[], variants[]

**Variant:** colorName, colorHex, imageUrls[], sizes[] ({ size, stock })

**Order:** id, status, paymentStatus, paymentMethod, items[], shipping, subtotal, discount, shippingFee, total, trackingNumber

## Prototype file map (storefront repo)

| Feature | Storefront path |
|---------|-----------------|
| Layout / sidebar | `app/admin/layout.tsx` |
| Dashboard | `app/admin/page.tsx` |
| Collections list | `app/admin/collections/page.tsx` |
| Collection edit | `app/admin/collections/[id]/page.tsx` |
| Collection create | `app/admin/collections/new/page.tsx` |
| Products list | `app/admin/products/page.tsx` |
| Product edit | `app/admin/products/[id]/page.tsx` |
| Product create | `app/admin/products/new/page.tsx` |
| Mock store | `lib/stores/admin-store.ts` |

When porting UI, replace `useAdminStore` with fetch hooks to `NEXT_PUBLIC_API_URL`.

## Backend spec location

Full JSON spec (v1.2.0+):

- Storefront: `docs/frontend-api-spec.json`
- Copy to admin repo as: `docs/backend-api-spec.json`

Key sections for admin dev:

- `environmentVariables` — backend vs storefront env (admin uses same as storefront: API URL only)
- `requests` → Admin group
- `schemas` → Collection, Product, ProductInput, Order
- `shipping` — context for order totals (backend-calculated)
- `paystack` / `paystackDashboardSetup` — backend only, for context when reviewing paid orders

## First Cursor prompt (paste in admin project)

```
You are building the Unapologetic admin dashboard.

Read AGENTS.md, docs/catalog-field-mapping.md, and docs/catalog-snapshot.json (38 products, 7 collections).
Read docs/backend-api-spec.json (Admin group + schemas).

This is separate from the customer storefront. Wire all data to NEXT_PUBLIC_API_URL/admin/*.
Products you publish must match the shapes in catalog-snapshot so the storefront can render grids, PDP, Quick Add, and checkout.

Use the storefront prototype at [path]/app/admin/** as UI reference only.

Start with: admin layout (black sidebar), collections list + create form, products list + create form with variants/sizes/stock.
Use sharp corners, zinc/white palette, black primary buttons. No Paystack in this app.
```

## Optional: multi-root workspace

Open both repos in one Cursor workspace to `@`-reference storefront `app/admin` files while coding the new admin project.

## Personal skill

Skill installed at `~/.cursor/skills/unapologetic-admin/SKILL.md`. Works in any project. Say "use unapologetic admin skill" or the agent may auto-load from description.
