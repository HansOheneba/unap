# Unapologetic Admin Dashboard Handoff

Use this folder to start the **separate admin dashboard** project with full context from the storefront.

## Quick start (new admin repo)

1. Create or open your admin dashboard repo in Cursor.
2. Copy these files into it:

   | From (storefront repo) | To (admin repo) |
   |------------------------|-----------------|
   | `handoff/ADMIN_AGENTS.md` | `AGENTS.md` (project root) |
   | `handoff/admin-handoff.md` | `docs/admin-handoff.md` |
   | `handoff/catalog-snapshot.json` | `docs/catalog-snapshot.json` |
   | `handoff/catalog-field-mapping.md` | `docs/catalog-field-mapping.md` |
   | `handoff/storefront-catalog-types.ts` | `docs/storefront-catalog-types.ts` |
   | `docs/frontend-api-spec.json` | `docs/backend-api-spec.json` |

3. Install the personal skill (once, all projects):

   ```bash
   # Skill already at ~/.cursor/skills/unapologetic-admin/
   # Cursor picks it up automatically. Mention "Unapologetic admin" in chat.
   ```

4. First Agent message in the admin project:

   ```
   Read AGENTS.md, docs/catalog-field-mapping.md, and docs/catalog-snapshot.json.
   Read docs/backend-api-spec.json Admin group.
   Build the Unapologetic admin dashboard. Match the 38 products and 7 collections in catalog-snapshot.
   Prototype UI: storefront app/admin/** (mock only).
   ```

## Refresh catalog snapshot

When products change in the storefront repo:

```bash
npx tsx scripts/export-catalog-handoff.ts
```

Then re-copy `handoff/catalog-snapshot.json` to the admin repo.

## Three-project architecture

| Project | Role |
|---------|------|
| **Storefront** (`unapologetic`) | Customer shopping. Reads published catalog. Calls `POST /orders`. |
| **Admin dashboard** (new repo) | CMS + order ops. Calls `/admin/*` APIs. |
| **Backend API** | Auth, catalog, orders, Paystack, webhooks. |

## Prototype reference (storefront repo only)

Do not ship storefront `/admin` routes. Use them as UI reference:

- `app/admin/layout.tsx` — black sidebar, zinc content area
- `app/admin/collections/**`
- `app/admin/products/**`
- `lib/stores/admin-store.ts` — mock data shape (replace with API)

## Storefront path (this repo)

```
/Users/hansopoku/Desktop/code/unapologetic
```
