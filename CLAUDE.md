@AGENTS.md

- Whenever you make any changes to the project run `npm run build` to ensure that your chanegs did not break anything before saying you are done

## Project: Unapologetic — Agent Learnings

### Layout & Sizing

- All structural page/section containers use `max-w-360` (not `max-w-7xl` or `max-w-5xl`). This is the site-wide content width. Always use `max-w-360 mx-auto` for top-level layout wrappers.
- The old `max-w-420` custom class was used temporarily during development; it has been replaced with `max-w-360`.

### Cart & State

- Cart state lives in `lib/stores/cart-store.ts` using Zustand v5 with `persist` + `devtools`. localStorage key is `unap-cart`.
- `CartItem` shape: `{ id, name, price (display string), priceNum (number), img, category, quantity }`.
- `AddToCartButton` component is at `components/ui/add-to-cart-button.tsx`. Use it on product cards across all collection pages.
- All 6 collection pages (boxers, headwear, sunglasses, tops, tracks, main collections) have `AddToCartButton` wired up.

### JSX Gotcha — Comma in Ternaries

- Never write two sibling JSX elements separated by a comma inside a ternary true-branch: `condition ? (<A />, <B />) : <C />`. JavaScript treats this as the comma operator and only the last element renders. Always wrap siblings in a fragment: `condition ? (<><A /><B /></>) : <C />`.

### Text Contrast

- Prefer `text-white/65` or higher for body text on dark backgrounds. Avoid `text-white/40` or `text-white/50` — they blend in too much. Minimum: `/55` for decorative text, `/65` for readable text.

### Forms & AutoComplete

- Always set `autoComplete` on all inputs in a form to prevent browsers from applying suggestions to the wrong fields (e.g. password suggestions on email inputs).

### No Em Dashes

- NEVER use em dashes (—) in any copy, headings, or UI text. Replace with a period, a new sentence, or restructure the phrase. This applies everywhere: page copy, components, labels, hero text, footers.
- Wrong: `"For those who don't just wear the brand — they embody it."`
- Right: `"For those who don't just wear the brand. They embody it."`

### Checkout

- Checkout page is at `app/checkout/page.tsx`. It pre-fills from `useOnboardingStore`, supports MoMo/Card/Cash, generates an order ID, and clears the cart on confirm.

### Routing

- Auth pages: `app/auth/login/page.tsx`, `app/auth/signup/page.tsx`
- Cart: `app/cart/page.tsx`
- Checkout: `app/checkout/page.tsx`
- Collections overview: `app/collections/page.tsx`
- Individual collections: `app/collections/[boxers|headwear|sunglasses|tops|tracks]/page.tsx`

---

## Theme & Visual Identity (Light Mode Conversion — May 2026)

### Overall Theme

- The site has been converted from dark mode to **light mode**. All content/UI sections use white/zinc palette.
- Exception: full-bleed image/video sections with dark overlays are intentionally KEPT DARK — they have image backgrounds with `from-black` gradient overlays.
- The `dark` CSS class was removed from all page roots — it was forcing Tailwind dark mode.

### Color Palette (Light Mode)

- Backgrounds: `bg-white`, `bg-zinc-50`
- Text primary: `text-zinc-900`
- Text secondary: `text-zinc-600`, `text-zinc-500`
- Text muted: `text-zinc-400`
- Borders: `border-zinc-100`, `border-zinc-200`
- Grid gaps (replacing `bg-white/5` etc.): `bg-zinc-100`
- Inputs: `bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-zinc-400`

### Button System (`components/ui/button.tsx`)

- Uses `@base-ui/react/button` + `cva`. Always use `<Button>` or `buttonVariants()` — never write inline-styled `<button>` elements.
- **Variants:**
  - `default` — `bg-black border-black text-white`, hover inverts to white bg / black text. **Primary CTA. Always use this.**
  - `outline` — transparent with `border-black text-black`, hover fills black. Use for secondary CTAs on light backgrounds.
  - `outline-white` — transparent with `border-white text-white`, hover fills white. **Use on dark/image/video backgrounds** (e.g. hero).
  - `secondary` — `border-zinc-200 text-zinc-600`, hover darkens border/text. Use for Back buttons, inline admin actions (Edit, Change, Add New).
  - `ghost` — no border, transparent. Use for icon buttons or very subtle actions.
  - `link` — underline style, no border/bg.
- **Sizes:** `default` (px-8 py-3), `xs`, `sm`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`
- **Rule:** `<Link>` elements that look like buttons should use `className={buttonVariants({ variant: "..." })}`.

### Header (`components/layout/header.tsx`)

- **Always black** — `bg-black` on all pages. Never goes white.
- On the home page hero (not scrolled): gradient overlay `bg-linear-to-b from-black/80 via-black/40 to-transparent` so it blends into the video.
- Logo: always `unap_logo_white.png`.
- All nav text, icons, hamburger lines: always white.
- Cart badge: `bg-white text-black` (inverted from nav so it pops on black bg).
- `isDark` is hardcoded `true` — remove any conditional dark/light logic in the header.

### Footer (`components/layout/footer.tsx`)

- **Always black** — `bg-black text-white`.
- Logo: `unap_logo_white.png`.
- Column headers: `text-white/90`. Nav links: `text-white/75`, hover `text-white`. Body copy: `text-white/85`.
- Top/bottom band text: `text-white/70`. Borders: `border-white/10`.
- "Get First Access" CTA: `bg-white text-black border-white`, hover inverts to `bg-black text-white`.
- Giant wordmark: `text-white/8` (subtle watermark).
- Copyright year: **2026**.

### Inner Circle Email Input (`components/home/inner-circle-section.tsx`)

- Email input: `bg-black border-black text-white placeholder:text-white/40 focus:border-white/60` — high contrast black field.
- JOIN button: `bg-black border-black text-white`, hover inverts to white.

### Full-Bleed / Image Sections — Keep Dark

These sections have dark image overlays and must stay dark (white text):

- Hero video section (`components/home/hero-section.tsx`)
- Any section with `bg-linear-to-t from-black` or `bg-linear-to-b from-black` overlay
- The-Creed hero, parallax sections
- Inner Circle full-bleed header

### Page-Level Notes

- All pages have `bg-white text-zinc-900` as their root.
- Removed all `dark` class prefixes from page `<main>` elements.
- `app/account/page.tsx` — tab nav uses `border-l-black` for active indicator.
- `app/auth/signup/page.tsx` — 3-step form; step connectors use `bg-zinc-400`/`bg-zinc-200`; checkbox uses `border-zinc-900 bg-zinc-900`.
- `app/tracking/page.tsx` — timeline dots use `ring-4 ring-white`; inactive dots `bg-zinc-200`.
