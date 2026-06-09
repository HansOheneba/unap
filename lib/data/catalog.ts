import type {
  CatalogApiResponse,
  Collection,
  Gender,
  OverviewCard,
  Product,
} from "./types";
import { BRAND_PLACEHOLDER as PH } from "./placeholders";

// ── Shared mock helpers (mirrors API variant builder) ───────────────────────

const M_SIZES = ["S", "M", "L", "XL", "XXL"];
const F_SIZES = ["XS", "S", "M", "L", "XL"];
const M_UNDERWEAR = ["S", "M", "L", "XL"];
const ONE_SIZE = ["One Size"];

function p(
  partial: Omit<Product, "details" | "careInstructions"> & {
    details?: string[];
    careInstructions?: string[];
  },
): Product {
  return {
    details: ["Premium construction", "Designed in Accra", "Unapologetic fit"],
    careInstructions: [
      "Machine wash cold",
      "Do not bleach",
      "Tumble dry low or line dry",
    ],
    ...partial,
  };
}

// ── Collection metadata ───────────────────────────────────────────────────────

export const COLLECTION_META: Omit<Collection, "products">[] = [
  {
    id: "underwear",
    subtitle: "Underwear",
    title: "The Second Skin",
    tagline: "What you wear underneath sets the tone for everything above it.",
    featured: "/collections/boxers/boxModel.jpg",
    href: "/collections/underwear",
  },
  {
    id: "tops",
    subtitle: "Tops",
    title: "The Anti-Uniform",
    tagline: "Move in silence. Let the fabric do the talking.",
    featured: "/collections/men_shirt/shirtCollection.jpeg",
    href: "/collections/tops",
  },
  {
    id: "bottoms",
    subtitle: "Bottoms",
    title: "Grounded Power",
    tagline: "Every step is a statement. Every stride is intentional.",
    featured: PH.mens,
    href: "/collections/bottoms",
  },
  {
    id: "tracksuits",
    subtitle: "Tracksuits",
    title: "Street Sovereign",
    tagline: "Built for motion. Designed for presence.",
    featured: "/collections/tracks/track.jpg",
    href: "/collections/tracksuits",
  },
  {
    id: "active-wear",
    subtitle: "Active Wear",
    title: "No Retreat",
    tagline: "Performance without apology. Movement without compromise.",
    featured: PH.movement,
    href: "/collections/active-wear",
  },
  {
    id: "sunglasses",
    subtitle: "Sunglasses",
    title: "The Eclipse Edit",
    tagline:
      "The world looks different when you stop apologizing for the view.",
    featured: "/collections/glases/outlawGlasses1.jpg",
    href: "/collections/sunglasses",
  },
  {
    id: "accessories",
    subtitle: "Accessories",
    title: "Bold Society",
    tagline: "The details that finish the statement.",
    featured: "/collections/headwear/boldSocietyCapBlack.jpeg",
    href: "/collections/accessories",
  },
];

// ── Products (only categories from the brand list) ──────────────────────────

export const CATALOG_PRODUCTS: Product[] = [
  // ── UNDERWEAR — Male ──────────────────────────────────────────────────────
  p({
    id: "no-apology-boxer-brief",
    slug: "no-apology-boxer-brief",
    name: "No Apology Boxer Brief",
    description:
      "Built for those who refuse to compromise. Combed cotton with a structured waistband and reinforced seams. The everyday essential that never asks permission.",
    price: 280,
    gender: "male",
    collectionId: "underwear",
    tag: "Essential",
    images: [
      "/collections/boxers/boxersBlackWhite.jpeg",
      "/collections/boxers/boxersBlackWhite2.jpeg",
    ],
    colors: [
      { name: "Midnight Black", hex: "#1a1a1a" },
      { name: "Stone White", hex: "#f5f0e8" },
      { name: "Slate Grey", hex: "#6b7280" },
    ],
    sizes: M_UNDERWEAR,
    details: [
      "95% Combed Cotton, 5% Elastane",
      "Structured waistband with woven label",
      "Flatlock seams",
      "Mid-rise fit",
    ],
  }),
  p({
    id: "silent-standard-trunk",
    slug: "silent-standard-trunk",
    name: "Silent Standard Trunk",
    description:
      "Shorter leg, same conviction. A trunk cut for warm climates and warmer confidence.",
    price: 260,
    gender: "male",
    collectionId: "underwear",
    tag: "Signature",
    images: [
      "/collections/boxers/boxersBlue.jpg",
      "/collections/boxers/boxersBlue2.jpg",
    ],
    colors: [
      { name: "Deep Navy", hex: "#1e3a5f" },
      { name: "Charcoal", hex: "#374151" },
    ],
    sizes: M_UNDERWEAR,
  }),
  p({
    id: "raw-edge-brief",
    slug: "raw-edge-brief",
    name: "Raw Edge Brief",
    description:
      "Minimal coverage. Maximum attitude. For the man who stripped away everything unnecessary.",
    price: 240,
    gender: "male",
    collectionId: "underwear",
    tag: "Bold",
    images: [
      "/collections/boxers/boxersCream.jpeg",
      "/collections/boxers/boxersCream2.jpeg",
    ],
    colors: [
      { name: "Sand", hex: "#d4c5a9" },
      { name: "Black", hex: "#1a1a1a" },
    ],
    sizes: M_UNDERWEAR,
  }),

  // ── UNDERWEAR — Female ────────────────────────────────────────────────────
  p({
    id: "unbound-lace-set",
    slug: "unbound-lace-set",
    name: "Unbound Lace Set",
    description:
      "Deliberate softness with unapologetic structure. A lace set that refuses to be invisible.",
    price: 420,
    gender: "female",
    collectionId: "underwear",
    tag: "Signature",
    images: ["/collections/female_undergarments/lingerie.jpeg"],
    colors: [
      { name: "Midnight Black", hex: "#1a1a1a" },
      { name: "Deep Wine", hex: "#6b1d3a" },
    ],
    sizes: F_SIZES,
    details: [
      "Stretch lace and mesh construction",
      "Adjustable straps",
      "Soft-touch lining",
    ],
    careInstructions: [
      "Hand wash cold",
      "Do not tumble dry",
      "Lay flat to dry",
    ],
  }),
  p({
    id: "second-skin-bodysuit",
    slug: "second-skin-bodysuit",
    name: "Second Skin Bodysuit",
    description:
      "One piece. Zero compromise. Sculpted to move with you and hold its line all day.",
    price: 480,
    gender: "female",
    collectionId: "underwear",
    tag: "Statement",
    images: ["/collections/female_undergarments/lingerie.jpeg"],
    colors: [{ name: "Onyx", hex: "#111111" }],
    sizes: F_SIZES,
  }),

  // ── TOPS — Male ───────────────────────────────────────────────────────────
  p({
    id: "anti-uniform-tee",
    slug: "anti-uniform-tee",
    name: "Anti-Uniform Tee",
    description:
      "Heavyweight cotton with a dropped shoulder and a presence that fills the room before you speak.",
    price: 380,
    gender: "male",
    collectionId: "tops",
    tag: "Essential",
    images: ["/collections/men_shirt/shirtCollection.jpeg"],
    colors: [
      { name: "Black", hex: "#1a1a1a" },
      { name: "Off White", hex: "#f5f0e8" },
    ],
    sizes: M_SIZES,
  }),
  p({
    id: "creed-heavyweight-tee",
    slug: "creed-heavyweight-tee",
    name: "Creed Heavyweight Tee",
    description:
      "240gsm cotton. Minimal branding. Maximum weight. For those who let the cloth speak first.",
    price: 420,
    gender: "male",
    collectionId: "tops",
    tag: "Signature",
    images: ["/collections/men_shirt/shirtCollection.jpeg"],
    colors: [{ name: "Black", hex: "#1a1a1a" }],
    sizes: M_SIZES,
  }),

  // ── TOPS — Female ─────────────────────────────────────────────────────────
  p({
    id: "sovereign-silk-blouse",
    slug: "sovereign-silk-blouse",
    name: "Sovereign Silk Blouse",
    description:
      "Fluid drape with sharp intent. A blouse for boardrooms, rooftops, and everywhere in between.",
    price: 520,
    gender: "female",
    collectionId: "tops",
    tag: "Signature",
    images: ["/collections/female_shirts/shirtBrown.jpeg"],
    colors: [
      { name: "Espresso", hex: "#3d2314" },
      { name: "Cream", hex: "#f5f0e8" },
    ],
    sizes: F_SIZES,
  }),
  p({
    id: "unapologetic-crop-tank",
    slug: "unapologetic-crop-tank",
    name: "Unapologetic Crop Tank",
    description:
      "Clean lines. Bare conviction. A cropped tank that does not negotiate with the weather or the room.",
    price: 280,
    gender: "female",
    collectionId: "tops",
    tag: "Bold",
    images: ["/collections/female_shirts/shirtCream.jpeg"],
    colors: [
      { name: "Black", hex: "#1a1a1a" },
      { name: "Ivory", hex: "#faf8f5" },
    ],
    sizes: F_SIZES,
  }),

  // ── BOTTOMS — Male ──────────────────────────────────────────────────────
  p({
    id: "shadow-cargo-pant",
    slug: "shadow-cargo-pant",
    name: "Shadow Cargo Pant",
    description:
      "Utility without the uniform. Relaxed cargo silhouette with reinforced pockets and a tapered leg.",
    price: 580,
    gender: "male",
    collectionId: "bottoms",
    tag: "Signature",
    images: [PH.mens],
    colors: [
      { name: "Black", hex: "#1a1a1a" },
      { name: "Olive", hex: "#4a5d3a" },
    ],
    sizes: M_SIZES,
  }),
  p({
    id: "refusal-straight-jean",
    slug: "refusal-straight-jean",
    name: "Refusal Straight Jean",
    description:
      "Straight leg. Dark wash. No distressing. Jeans that look like they have never asked for approval.",
    price: 620,
    gender: "male",
    collectionId: "bottoms",
    tag: "Classic",
    images: [PH.mens],
    colors: [{ name: "Indigo Black", hex: "#1c1c2e" }],
    sizes: M_SIZES,
  }),
  p({
    id: "silent-standard-short",
    slug: "silent-standard-short",
    name: "Silent Standard Short",
    description:
      "Above the knee. Below the noise. Tailored shorts for Accra heat and global presence.",
    price: 380,
    gender: "male",
    collectionId: "bottoms",
    tag: "Essential",
    images: [PH.mens],
    colors: [
      { name: "Black", hex: "#1a1a1a" },
      { name: "Stone", hex: "#9ca3af" },
    ],
    sizes: M_SIZES,
  }),

  // ── BOTTOMS — Female ──────────────────────────────────────────────────────
  p({
    id: "high-rise-power-pant",
    slug: "high-rise-power-pant",
    name: "High-Rise Power Pant",
    description:
      "Structured waist. Clean leg. A trouser that commands the room without raising its voice.",
    price: 640,
    gender: "female",
    collectionId: "bottoms",
    tag: "Signature",
    images: [PH.womens],
    colors: [
      { name: "Black", hex: "#1a1a1a" },
      { name: "Camel", hex: "#c4a882" },
    ],
    sizes: F_SIZES,
  }),
  p({
    id: "curve-cargo-pant",
    slug: "curve-cargo-pant",
    name: "Curve Cargo Pant",
    description:
      "Relaxed fit with intentional volume. Cargo pockets reimagined for movement and style.",
    price: 560,
    gender: "female",
    collectionId: "bottoms",
    tag: "Bold",
    images: ["/collections/female_shirts/shirtBrown.jpeg"],
    colors: [{ name: "Charcoal", hex: "#374151" }],
    sizes: F_SIZES,
  }),

  // ── TRACKSUITS — Male ─────────────────────────────────────────────────────
  p({
    id: "street-sovereign-track-set",
    slug: "street-sovereign-track-set",
    name: "Street Sovereign Track Set",
    description:
      "Full zip jacket and tapered jogger in matching heavyweight fleece. Built for the street, refined for everywhere else.",
    price: 980,
    gender: "male",
    collectionId: "tracksuits",
    tag: "Signature",
    images: [
      "/collections/tracks/track.jpg",
      "/collections/tracks/track2.jpg",
    ],
    colors: [
      { name: "Black", hex: "#1a1a1a" },
      { name: "Grey Marl", hex: "#6b7280" },
    ],
    sizes: M_SIZES,
  }),
  p({
    id: "no-apology-track-pant",
    slug: "no-apology-track-pant",
    name: "No Apology Track Pant",
    description:
      "The jogger that started it all. Tapered leg, ribbed cuffs, and a waistband that holds its ground.",
    price: 520,
    gender: "male",
    collectionId: "tracksuits",
    tag: "Essential",
    images: ["/collections/tracks/track2.jpg"],
    colors: [{ name: "Black", hex: "#1a1a1a" }],
    sizes: M_SIZES,
  }),

  // ── TRACKSUITS — Female ───────────────────────────────────────────────────
  p({
    id: "eclipse-track-set",
    slug: "eclipse-track-set",
    name: "Eclipse Track Set",
    description:
      "Cropped zip jacket and high-waist jogger. Monochrome power with a silhouette that does the talking.",
    price: 920,
    gender: "female",
    collectionId: "tracksuits",
    tag: "Signature",
    images: ["/collections/tracks/track.jpg"],
    colors: [
      { name: "Black", hex: "#1a1a1a" },
      { name: "Stone", hex: "#d1d5db" },
    ],
    sizes: F_SIZES,
  }),
  p({
    id: "power-movement-jogger",
    slug: "power-movement-jogger",
    name: "Power Movement Jogger",
    description:
      "Soft fleece, sharp taper. The jogger you reach for when comfort and presence must coexist.",
    price: 480,
    gender: "female",
    collectionId: "tracksuits",
    tag: "Essential",
    images: ["/collections/tracks/track2.jpg"],
    colors: [{ name: "Black", hex: "#1a1a1a" }],
    sizes: F_SIZES,
  }),

  // ── ACTIVE WEAR — Male ────────────────────────────────────────────────────
  p({
    id: "performance-refusal-tee",
    slug: "performance-refusal-tee",
    name: "Performance Refusal Tee",
    description:
      "Moisture-wicking mesh with a relaxed athletic cut. Train hard. Look sharper than everyone else in the room.",
    price: 340,
    gender: "male",
    collectionId: "active-wear",
    tag: "Performance",
    images: [PH.movement],
    colors: [
      { name: "Black", hex: "#1a1a1a" },
      { name: "Graphite", hex: "#4b5563" },
    ],
    sizes: M_SIZES,
  }),
  p({
    id: "sprint-standard-short",
    slug: "sprint-standard-short",
    name: "Sprint Standard Short",
    description:
      "Lightweight training short with inner brief and zip pocket. Built for speed, finished for style.",
    price: 320,
    gender: "male",
    collectionId: "active-wear",
    tag: "Essential",
    images: [PH.movement],
    colors: [{ name: "Black", hex: "#1a1a1a" }],
    sizes: M_SIZES,
  }),
  p({
    id: "training-essential-quarter-zip",
    slug: "training-essential-quarter-zip",
    name: "Training Essential Quarter-Zip",
    description:
      "Layer up without slowing down. Quarter-zip pullover in technical fleece for early runs and late sessions.",
    price: 480,
    gender: "male",
    collectionId: "active-wear",
    tag: "Signature",
    images: [PH.movement],
    colors: [{ name: "Black", hex: "#1a1a1a" }],
    sizes: M_SIZES,
  }),

  // ── ACTIVE WEAR — Female ──────────────────────────────────────────────────
  p({
    id: "flex-sovereign-legging",
    slug: "flex-sovereign-legging",
    name: "Flex Sovereign Legging",
    description:
      "High-compression legging with a sculpting waistband. Holds you in. Lets you move without limits.",
    price: 420,
    gender: "female",
    collectionId: "active-wear",
    tag: "Signature",
    images: [PH.womens],
    colors: [
      { name: "Black", hex: "#1a1a1a" },
      { name: "Deep Plum", hex: "#4a1942" },
    ],
    sizes: F_SIZES,
  }),
  p({
    id: "power-movement-sports-bra",
    slug: "power-movement-sports-bra",
    name: "Power Movement Sports Bra",
    description:
      "Medium support. Maximum confidence. Racerback design with a clean front and zero distractions.",
    price: 280,
    gender: "female",
    collectionId: "active-wear",
    tag: "Essential",
    images: ["/home/hoodieBlackMan.jpg"],
    colors: [
      { name: "Black", hex: "#1a1a1a" },
      { name: "White", hex: "#f5f0e8" },
    ],
    sizes: F_SIZES,
  }),
  p({
    id: "active-refusal-tank",
    slug: "active-refusal-tank",
    name: "Active Refusal Tank",
    description:
      "Breathable mesh tank with a cropped athletic fit. For the woman who does not cool down.",
    price: 260,
    gender: "female",
    collectionId: "active-wear",
    tag: "Bold",
    images: [PH.womens],
    colors: [{ name: "Black", hex: "#1a1a1a" }],
    sizes: F_SIZES,
  }),

  // ── SUNGLASSES (Male + Female) ────────────────────────────────────────────
  p({
    id: "outlaw-i",
    slug: "outlaw-i",
    name: "Outlaw I",
    description:
      "Oversized black frames with UV400 polarized lenses. For those who move through the world on their own terms.",
    price: 1200,
    gender: "male",
    collectionId: "sunglasses",
    tag: "Signature",
    images: ["/collections/glases/outlawGlasses1.jpg"],
    sizes: ONE_SIZE,
    details: [
      "UV400 polarized lenses",
      "Stainless steel hinges",
      "Acetate frame",
    ],
    careInstructions: [
      "Store in provided case",
      "Clean with microfiber cloth only",
      "Avoid extreme heat",
    ],
  }),
  p({
    id: "obsidian-lens",
    slug: "obsidian-lens",
    name: "Obsidian Lens",
    description:
      "Deep-tinted lenses in a sculpted rectangular frame. A statement piece that demands no explanation.",
    price: 1350,
    gender: "male",
    collectionId: "sunglasses",
    tag: "Statement",
    images: ["/collections/glases/outlawGlasses3.jpg"],
    sizes: ONE_SIZE,
  }),
  p({
    id: "outlaw-iii",
    slug: "outlaw-iii",
    name: "Outlaw III",
    description:
      "Classic proportions meet Unapologetic attitude. Bold enough to be noticed, clean enough to go anywhere.",
    price: 1100,
    gender: "male",
    collectionId: "sunglasses",
    tag: "Classic",
    images: ["/collections/glases/outlawGlases4.jpg"],
    sizes: ONE_SIZE,
  }),
  p({
    id: "eclipse-shades",
    slug: "eclipse-shades",
    name: "Eclipse Shades",
    description:
      "Wraparound silhouette with mirrored lenses. Limited production. Reflect everything the world throws at you.",
    price: 1180,
    gender: "male",
    collectionId: "sunglasses",
    tag: "Limited",
    images: ["/collections/glases/outlawGlasses5.jpg"],
    sizes: ONE_SIZE,
  }),
  p({
    id: "sovereign-shades",
    slug: "sovereign-shades",
    name: "Sovereign Shades",
    description:
      "Sleek cat-eye geometry with polarized lenses. For the woman who has already decided.",
    price: 980,
    gender: "female",
    collectionId: "sunglasses",
    tag: "Signature",
    images: ["/collections/glases/shadesFemale.jpg"],
    sizes: ONE_SIZE,
  }),
  p({
    id: "sovereign-ii",
    slug: "sovereign-ii",
    name: "Sovereign II",
    description:
      "Gradient lenses on a wider frame. Made for the ones who refuse to blend in.",
    price: 980,
    gender: "female",
    collectionId: "sunglasses",
    tag: "Statement",
    images: ["/collections/glases/shadesFemale2.jpg"],
    sizes: ONE_SIZE,
  }),
  p({
    id: "obsidian-womens",
    slug: "obsidian-womens",
    name: "Obsidian Womens",
    description:
      "Full black, full presence. Bold geometry for every room you walk into and own.",
    price: 1100,
    gender: "female",
    collectionId: "sunglasses",
    tag: "Bold",
    images: ["/collections/glases/shadesFemale3.jpg"],
    sizes: ONE_SIZE,
  }),

  // ── ACCESSORIES — Caps ────────────────────────────────────────────────────
  p({
    id: "bold-society-cap",
    slug: "bold-society-cap",
    name: "Bold Society Cap",
    description:
      "Six-panel structured cap with embroidered wordmark. The finishing piece for those who stopped asking for a seat.",
    price: 380,
    gender: "male",
    collectionId: "accessories",
    subcategory: "caps",
    tag: "Signature",
    images: [
      "/collections/headwear/boldSocietyCapBlack.jpeg",
      "/collections/headwear/boldSocietyCapBlack2.jpeg",
    ],
    colors: [
      { name: "Black", hex: "#1a1a1a" },
      { name: "Cream", hex: "#f5f0e8" },
      { name: "Red", hex: "#c41e3a" },
    ],
    sizes: ONE_SIZE,
  }),
  p({
    id: "refusal-brim-cap",
    slug: "refusal-brim-cap",
    name: "Refusal Brim Cap",
    description:
      "Suede finish with a low profile and a brim that holds its line. Understated until it is not.",
    price: 480,
    gender: "male",
    collectionId: "accessories",
    subcategory: "caps",
    tag: "Premium",
    images: [
      "/collections/headwear/suedeCapBlack.jpg",
      "/collections/headwear/suedeCapBlack2.jpeg",
    ],
    colors: [{ name: "Black Suede", hex: "#1a1a1a" }],
    sizes: ONE_SIZE,
  }),
  p({
    id: "sovereign-cap",
    slug: "sovereign-cap",
    name: "Sovereign Cap",
    description:
      "Structured cap in a feminine proportion. Same conviction. Sharper silhouette.",
    price: 380,
    gender: "female",
    collectionId: "accessories",
    subcategory: "caps",
    tag: "Signature",
    images: ["/collections/headwear/boldSocietyCapCream.jpeg"],
    colors: [
      { name: "Cream", hex: "#f5f0e8" },
      { name: "Black", hex: "#1a1a1a" },
    ],
    sizes: ONE_SIZE,
  }),

  // ── ACCESSORIES — Beanies ─────────────────────────────────────────────────
  p({
    id: "classic-knit-beanie",
    slug: "classic-knit-beanie",
    name: "Classic Knit Beanie",
    description:
      "Ribbed knit with a folded cuff and minimal branding. Warmth without the noise.",
    price: 260,
    gender: "male",
    collectionId: "accessories",
    subcategory: "beanies",
    tag: "Essential",
    images: ["/collections/headwear/beanie.jpg"],
    colors: [
      { name: "Black", hex: "#1a1a1a" },
      { name: "Red", hex: "#c41e3a" },
    ],
    sizes: ONE_SIZE,
  }),
  p({
    id: "statement-beanie",
    slug: "statement-beanie",
    name: "Statement Beanie",
    description:
      "Oversized knit with a slouch fit. For cold mornings and colder intentions.",
    price: 280,
    gender: "female",
    collectionId: "accessories",
    subcategory: "beanies",
    tag: "Bold",
    images: ["/collections/headwear/beanieRed.jpg"],
    colors: [{ name: "Burgundy", hex: "#7f1d1d" }],
    sizes: ONE_SIZE,
  }),

  // ── ACCESSORIES — Socks ───────────────────────────────────────────────────
  p({
    id: "no-apology-crew-sock",
    slug: "no-apology-crew-sock",
    name: "No Apology Crew Sock",
    description:
      "Cushioned crew sock with ribbed cuff and woven wordmark. The detail most people skip. We did not.",
    price: 120,
    gender: "male",
    collectionId: "accessories",
    subcategory: "socks",
    tag: "Essential",
    images: [PH.textile],
    colors: [
      { name: "Black", hex: "#1a1a1a" },
      { name: "White", hex: "#f5f0e8" },
    ],
    sizes: ["S/M", "L/XL"],
  }),
  p({
    id: "silent-standard-ankle-sock",
    slug: "silent-standard-ankle-sock",
    name: "Silent Standard Ankle Sock",
    description:
      "Low-cut performance sock with arch support. Invisible under sneakers. Present in every step.",
    price: 100,
    gender: "female",
    collectionId: "accessories",
    subcategory: "socks",
    tag: "Essential",
    images: [PH.textile],
    colors: [{ name: "Black", hex: "#1a1a1a" }],
    sizes: ["S/M", "L/XL"],
  }),
];

// ── Derived collections + API envelope ──────────────────────────────────────

export function buildCollections(): Collection[] {
  return COLLECTION_META.map((meta) => ({
    ...meta,
    products: CATALOG_PRODUCTS.filter((p) => p.collectionId === meta.id),
  }));
}

export const DEFAULT_COLLECTIONS = buildCollections();

export const OVERVIEW_CARDS: OverviewCard[] = COLLECTION_META.map((c) => ({
  id: c.id,
  label: c.subtitle,
  img: c.featured,
  description: c.tagline,
}));

export function getCatalogApiResponse(): CatalogApiResponse {
  return {
    data: {
      collections: DEFAULT_COLLECTIONS,
      products: CATALOG_PRODUCTS,
    },
    meta: {
      version: "1.0.0",
      totalProducts: CATALOG_PRODUCTS.length,
      lastUpdated: "2026-06-09",
    },
  };
}

export function getCollectionById(id: string): Collection | undefined {
  return DEFAULT_COLLECTIONS.find((c) => c.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return CATALOG_PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCollection(
  collectionId: string,
  gender?: Gender,
): Product[] {
  return CATALOG_PRODUCTS.filter(
    (p) =>
      p.collectionId === collectionId &&
      (gender === undefined || p.gender === gender),
  );
}
