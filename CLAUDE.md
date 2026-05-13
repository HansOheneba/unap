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

### Checkout

- Checkout page is at `app/checkout/page.tsx`. It pre-fills from `useOnboardingStore`, supports MoMo/Card/Cash, generates an order ID, and clears the cart on confirm.

### Routing

- Auth pages: `app/auth/login/page.tsx`, `app/auth/signup/page.tsx`
- Cart: `app/cart/page.tsx`
- Checkout: `app/checkout/page.tsx`
- Collections overview: `app/collections/page.tsx`
- Individual collections: `app/collections/[boxers|headwear|sunglasses|tops|tracks]/page.tsx`
