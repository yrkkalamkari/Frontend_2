# YRK Collections — frontend

Next.js (App Router) + Tailwind + Framer Motion. Implements the "minimal luxury" design system: cream/beige/brown/gold palette, Playfair Display headings, Inter body text, soft shadows, rounded corners, hover micro-animations. Talks to the backend built earlier via `NEXT_PUBLIC_API_URL`.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in your backend URL + Google client ID
npm run dev
```

Open `http://localhost:3000`.

## Branding

- Brand name ("YRK Collections") is wired into the navbar, page title, PWA manifest, and footer.
- Footer contact email is `yrkcollection@gmail.com`.
- **Logo**: the navbar looks for a round logo at `public/logo.png` (any square or round image works — it's clipped into a circle via CSS). Until you add one, it falls back to showing "YRK" as text in a beige circle. Drop your actual logo file in as `public/logo.png` and it picks it up automatically, no code changes needed.
- Update the phone number placeholder in `components/Footer.jsx` (currently `+91 00000 00000`) with your real one.
- "Kalamkari" is kept throughout as the craft/product name (e.g. "Handcrafted Kalamkari Collection") — that's the product line, YRK Collections is the brand selling it, same relationship as "Nike — Air Jordan."

## What's implemented

- **Design system** — Tailwind theme (`tailwind.config.js`) with the cream/beige/brown/gold palette, `rounded-xl2` (18px), soft shadows, Playfair Display + Inter fonts loaded via `next/font/google`.
- **Google-only login** — `components/GoogleLoginButton.jsx` renders the real Google Identity Services button; `context/AuthContext.jsx` handles the token exchange and hydrates the user's profile (addresses, cart, wishlist) right after login.
- **Cart & wishlist** — `context/CartContext.jsx`, backed entirely by the server so it's there on any device after login.
- **Pages**: home (hero, trust badges, categories, new arrivals, "why Kalamkari", newsletter), product listing (filters + sort + pagination), product detail (gallery, accordion, sticky mobile CTA), cart, multi-step checkout (address → review → payment), order history + order detail with a timeline, wishlist, profile, and a full admin panel (products with image upload, coupons, order status management).
- **PWA** — `public/manifest.json` + `public/sw.js` + registration in the layout. Installable on mobile/desktop out of the box. **You still need to drop real 192×192 and 512×512 PNG icons into `public/icons/`** — placeholders aren't included.
- **Loading states** — shimmer skeletons (`components/Skeleton.jsx`) instead of spinners, empty states (`components/EmptyState.jsx`) for cart/wishlist/orders.

## What from the design brief is NOT built yet (left as extensions)

The design brief you shared was extensive — here's what's intentionally left out so this ships as a solid, working core rather than a half-finished everything:

- Flash sale countdown section with progress bars
- "Trending today" / "Recently viewed" / "You may like" recommendation rails
- Customer review carousel, Instagram gallery
- Web push notifications (needs a push service + backend endpoint to store subscriptions — the backend doesn't have this yet)
- Dark mode, product compare, gift wrapping, "notify me when back in stock"
- Instant/autocomplete search (currently the search icon is a placeholder — the backend's `search` query param on `/products` is already there and ready to wire up)

All of these slot into the existing structure without architectural changes — say the word on any of them and they can be added next.

## Connecting to your backend

Set in `.env.local`:
```
NEXT_PUBLIC_API_URL=https://<your-deployed-backend>/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<same client ID as the backend's .env>
```

Also remember: on the **backend**, set `FRONTEND_URL` to wherever this app ends up deployed (e.g. `https://yourstore.vercel.app`) so CORS allows it.

## Deploying

Vercel is the natural fit for a Next.js app and has a generous free tier:
```bash
npm install -g vercel
vercel
```
Or connect the GitHub repo directly at vercel.com and set the two env vars above in the project settings. Netlify works too with the `@netlify/plugin-nextjs` adapter if you'd rather use that.
