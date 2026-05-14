// ─────────────────────────────────────────────────────────────────────────────
// Mock product backend — swap the PRODUCTS array for real API data later.
// ─────────────────────────────────────────────────────────────────────────────

export type SizeStock = {
  size: string;
  stock: number; // 0 = out of stock
};

export type ColorVariant = {
  id: string;
  colorName: string;
  colorHex: string;
  images: string[];
  sizes: SizeStock[];
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tag: string;
  collectionId: string;
  variants: ColorVariant[];
  details: string[];
  careInstructions: string[];
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

export const PRODUCTS: Product[] = [
  // ── BOXERS ─────────────────────────────────────────────────────────────────
  {
    id: "comfortfit-cotton-boxers",
    slug: "comfortfit-cotton-boxers",
    name: "ComfortFit Cotton Boxers",
    description:
      "Built for those who refuse to compromise. The ComfortFit Cotton Boxer is cut from 100% combed cotton with a reinforced waistband and tagless interior. Everyday wear, elevated.",
    price: 280,
    category: "boxers",
    tag: "Essential",
    collectionId: "boxers",
    variants: [
      {
        id: "midnight-black",
        colorName: "Midnight Black",
        colorHex: "#1a1a1a",
        images: [
          "/collections/boxers/boxersBlackWhite.jpeg",
          "/collections/boxers/boxersBlackWhite2.jpeg",
        ],
        sizes: [
          { size: "S", stock: 14 },
          { size: "M", stock: 22 },
          { size: "L", stock: 18 },
          { size: "XL", stock: 7 },
          { size: "XXL", stock: 3 },
        ],
      },
      {
        id: "arctic-white",
        colorName: "Arctic White",
        colorHex: "#f0f0f0",
        images: [
          "/collections/boxers/boxersWhite.jpg",
          "/collections/boxers/boxersWhite2.jpeg",
        ],
        sizes: [
          { size: "S", stock: 9 },
          { size: "M", stock: 15 },
          { size: "L", stock: 11 },
          { size: "XL", stock: 4 },
          { size: "XXL", stock: 0 },
        ],
      },
      {
        id: "ocean-blue",
        colorName: "Ocean Blue",
        colorHex: "#3b6ea5",
        images: [
          "/collections/boxers/boxersBlue.jpg",
          "/collections/boxers/boxersBlue2.jpg",
        ],
        sizes: [
          { size: "S", stock: 6 },
          { size: "M", stock: 10 },
          { size: "L", stock: 8 },
          { size: "XL", stock: 2 },
          { size: "XXL", stock: 0 },
        ],
      },
      {
        id: "slate-gray",
        colorName: "Slate Gray",
        colorHex: "#8a8a8a",
        images: [
          "/collections/boxers/boxersGray.jpg",
          "/collections/boxers/boxersGray2.jpg",
        ],
        sizes: [
          { size: "S", stock: 5 },
          { size: "M", stock: 12 },
          { size: "L", stock: 9 },
          { size: "XL", stock: 3 },
          { size: "XXL", stock: 1 },
        ],
      },
      {
        id: "soft-cream",
        colorName: "Soft Cream",
        colorHex: "#f0e6ce",
        images: [
          "/collections/boxers/boxersCream.jpeg",
          "/collections/boxers/boxersCream2.jpeg",
        ],
        sizes: [
          { size: "S", stock: 4 },
          { size: "M", stock: 7 },
          { size: "L", stock: 5 },
          { size: "XL", stock: 0 },
          { size: "XXL", stock: 2 },
        ],
      },
    ],
    details: [
      "100% Combed Cotton",
      "Tagless interior for all-day comfort",
      "Reinforced logo waistband",
      "Pre-shrunk fabric",
      "Mid-rise fit",
    ],
    careInstructions: [
      "Machine wash cold with similar colors",
      "Tumble dry low",
      "Do not bleach",
      "Do not iron directly on waistband",
    ],
  },
  {
    id: "activeflex-performance-boxers",
    slug: "activeflex-performance-boxers",
    name: "ActiveFlex Performance Boxers",
    description:
      "Engineered for the athlete who moves without limits. The ActiveFlex combines moisture-wicking fabric with four-way stretch for unrestricted performance. From the gym to the streets.",
    price: 350,
    category: "boxers",
    tag: "Performance",
    collectionId: "boxers",
    variants: [
      {
        id: "midnight-black",
        colorName: "Midnight Black",
        colorHex: "#1a1a1a",
        images: [
          "/collections/boxers/boxersBlackWhite2.jpeg",
          "/collections/boxers/boxModel.jpg",
        ],
        sizes: [
          { size: "S", stock: 11 },
          { size: "M", stock: 20 },
          { size: "L", stock: 16 },
          { size: "XL", stock: 8 },
          { size: "XXL", stock: 2 },
        ],
      },
      {
        id: "ocean-blue",
        colorName: "Ocean Blue",
        colorHex: "#3b6ea5",
        images: [
          "/collections/boxers/boxersBlue.jpg",
          "/collections/boxers/boxersBlue2.jpg",
        ],
        sizes: [
          { size: "S", stock: 7 },
          { size: "M", stock: 13 },
          { size: "L", stock: 10 },
          { size: "XL", stock: 0 },
          { size: "XXL", stock: 3 },
        ],
      },
      {
        id: "walnut-brown",
        colorName: "Walnut Brown",
        colorHex: "#8B6355",
        images: [
          "/collections/boxers/boxersBrown.jpeg",
          "/collections/boxers/boxersBrown2.jpeg",
        ],
        sizes: [
          { size: "S", stock: 3 },
          { size: "M", stock: 8 },
          { size: "L", stock: 6 },
          { size: "XL", stock: 1 },
          { size: "XXL", stock: 0 },
        ],
      },
    ],
    details: [
      "87% Polyester, 13% Elastane",
      "Four-way stretch fabric",
      "Moisture-wicking technology",
      "Flatlock seams to prevent chafing",
      "Quick-dry finish",
    ],
    careInstructions: [
      "Machine wash cold",
      "Tumble dry low",
      "Do not bleach or iron",
      "Do not use fabric softener",
    ],
  },
  {
    id: "luxesoft-premium-boxers",
    slug: "luxesoft-premium-boxers",
    name: "LuxeSoft Premium Boxers",
    description:
      "The pinnacle of everyday luxury. LuxeSoft Premium Boxers are crafted from ultra-smooth Supima cotton with a seamless waistband and a tailored fit. For those who settle for nothing less.",
    price: 420,
    category: "boxers",
    tag: "Signature",
    collectionId: "boxers",
    variants: [
      {
        id: "midnight-black",
        colorName: "Midnight Black",
        colorHex: "#1a1a1a",
        images: [
          "/collections/boxers/boxersMixed.jpeg",
          "/collections/boxers/boxModel.jpg",
        ],
        sizes: [
          { size: "S", stock: 6 },
          { size: "M", stock: 14 },
          { size: "L", stock: 10 },
          { size: "XL", stock: 5 },
          { size: "XXL", stock: 0 },
        ],
      },
      {
        id: "soft-cream",
        colorName: "Soft Cream",
        colorHex: "#f0e6ce",
        images: [
          "/collections/boxers/boxersCream.jpeg",
          "/collections/boxers/boxersCream2.jpeg",
        ],
        sizes: [
          { size: "S", stock: 4 },
          { size: "M", stock: 9 },
          { size: "L", stock: 7 },
          { size: "XL", stock: 2 },
          { size: "XXL", stock: 0 },
        ],
      },
      {
        id: "walnut-brown",
        colorName: "Walnut Brown",
        colorHex: "#8B6355",
        images: [
          "/collections/boxers/boxersBrown.jpeg",
          "/collections/boxers/boxersBrown2.jpeg",
        ],
        sizes: [
          { size: "S", stock: 2 },
          { size: "M", stock: 5 },
          { size: "L", stock: 3 },
          { size: "XL", stock: 0 },
          { size: "XXL", stock: 0 },
        ],
      },
    ],
    details: [
      "100% Supima Cotton",
      "Seamless waistband for ultimate comfort",
      "Tailored mid-rise fit",
      "Ultra-soft brushed interior",
      "Anti-pilling treatment",
    ],
    careInstructions: [
      "Machine wash cold on gentle cycle",
      "Lay flat to dry",
      "Do not bleach",
      "Cool iron if needed",
    ],
  },

  // ── HEADWEAR ───────────────────────────────────────────────────────────────
  {
    id: "bold-society-cap",
    slug: "bold-society-cap",
    name: "Bold Society Cap",
    description:
      "A statement you wear on your head. The Bold Society Cap is structured, uncompromising, and built for those who never needed permission to stand out. Six-panel construction with an embroidered Unapologetic mark.",
    price: 380,
    category: "headwear",
    tag: "Signature",
    collectionId: "headwear",
    variants: [
      {
        id: "jet-black",
        colorName: "Jet Black",
        colorHex: "#111111",
        images: [
          "/collections/headwear/boldSocietyCapBlack.jpeg",
          "/collections/headwear/boldSocietyCapBlack2.jpeg",
          "/collections/headwear/boldSocietyCapBlack3.jpeg",
        ],
        sizes: [
          { size: "S/M", stock: 12 },
          { size: "L/XL", stock: 9 },
        ],
      },
      {
        id: "cardinal-red",
        colorName: "Cardinal Red",
        colorHex: "#9b2335",
        images: [
          "/collections/headwear/boldSocietyCapRed.jpeg",
          "/collections/headwear/boldSocietyCapRed2.jpeg",
          "/collections/headwear/boldSocietyCapRed3.jpeg",
          "/collections/headwear/boldSocietyCapRed4.jpeg",
        ],
        sizes: [
          { size: "S/M", stock: 5 },
          { size: "L/XL", stock: 3 },
        ],
      },
      {
        id: "natural-cream",
        colorName: "Natural Cream",
        colorHex: "#e8dcc8",
        images: [
          "/collections/headwear/boldSocietyCapCream.jpeg",
          "/collections/headwear/boldSocietyCapCream2.jpeg",
          "/collections/headwear/boldSocietyCapCream3.jpeg",
        ],
        sizes: [
          { size: "S/M", stock: 8 },
          { size: "L/XL", stock: 6 },
        ],
      },
    ],
    details: [
      "Six-panel structured cap",
      "Pre-curved brim",
      "Embroidered Unapologetic wordmark",
      "Adjustable snap-back closure",
      "100% Cotton twill",
    ],
    careInstructions: [
      "Spot clean only",
      "Do not machine wash",
      "Air dry and reshape while damp",
    ],
  },
  {
    id: "classic-knit-beanie",
    slug: "classic-knit-beanie",
    name: "Classic Knit Beanie",
    description:
      "Cut from premium ribbed knit, the Classic Beanie sits low and holds its shape. A cold-weather essential with Unapologetic energy woven into every thread.",
    price: 260,
    category: "headwear",
    tag: "Essential",
    collectionId: "headwear",
    variants: [
      {
        id: "natural-tan",
        colorName: "Natural Tan",
        colorHex: "#c4a882",
        images: ["/collections/headwear/beanie.jpg"],
        sizes: [{ size: "One Size", stock: 18 }],
      },
      {
        id: "crimson-red",
        colorName: "Crimson Red",
        colorHex: "#b22222",
        images: [
          "/collections/headwear/beanieRed.jpg",
          "/collections/headwear/beanieRed2.jpg",
        ],
        sizes: [{ size: "One Size", stock: 7 }],
      },
    ],
    details: [
      "Merino Wool blend",
      "Fine ribbed knit construction",
      "Embroidered logo tab",
      "One-size-fits-most",
      "Cuffed hem",
    ],
    careInstructions: [
      "Hand wash cold",
      "Lay flat to dry",
      "Do not tumble dry",
      "Do not bleach",
    ],
  },
  {
    id: "suede-cap",
    slug: "suede-cap",
    name: "Suede Cap",
    description:
      "Premium suede meets clean structure. The Suede Cap is a minimal, unbranded piece built for those who let the fabric speak. Low-profile, medium-crown, adjustable fit.",
    price: 480,
    category: "headwear",
    tag: "Premium",
    collectionId: "headwear",
    variants: [
      {
        id: "jet-black",
        colorName: "Jet Black",
        colorHex: "#111111",
        images: [
          "/collections/headwear/suedeCapBlack.jpg",
          "/collections/headwear/suedeCapBlack2.jpeg",
        ],
        sizes: [
          { size: "S/M", stock: 6 },
          { size: "L/XL", stock: 4 },
        ],
      },
    ],
    details: [
      "Premium faux suede exterior",
      "Structured low-profile crown",
      "Adjustable snap-back closure",
      "Sweat-wicking interior band",
      "Flat brim with slight curve",
    ],
    careInstructions: [
      "Spot clean with damp cloth",
      "Do not machine wash or submerge",
      "Air dry away from direct heat",
    ],
  },

  // ── TRACKS ─────────────────────────────────────────────────────────────────
  {
    id: "signature-track-pant",
    slug: "signature-track-pant",
    name: "Signature Track Pant",
    description:
      "Streamlined for movement, refined for the streets. The Signature Track Pant pairs precision tailoring with premium tricot fabric. A pant that moves with you without apology.",
    price: 750,
    category: "tracks",
    tag: "Signature",
    collectionId: "tracks",
    variants: [
      {
        id: "midnight-black",
        colorName: "Midnight Black",
        colorHex: "#1a1a1a",
        images: [
          "/collections/tracks/track.jpg",
          "/collections/tracks/track2.jpg",
        ],
        sizes: [
          { size: "S", stock: 8 },
          { size: "M", stock: 14 },
          { size: "L", stock: 11 },
          { size: "XL", stock: 5 },
          { size: "XXL", stock: 2 },
        ],
      },
    ],
    details: [
      "100% Polyester tricot",
      "Tapered leg silhouette",
      "Side contrast stripe detail",
      "Elastic waistband with interior drawcord",
      "Zip ankle cuffs",
      "Two side zip pockets",
    ],
    careInstructions: [
      "Machine wash cold",
      "Tumble dry low",
      "Do not bleach or iron",
    ],
  },

  // ── HOODIES ────────────────────────────────────────────────────────────────
  {
    id: "classic-hoodie",
    slug: "classic-hoodie",
    name: "Classic Hoodie",
    description:
      "Not just a hoodie. A declaration. The Classic Hoodie is built from heavyweight French terry cotton with a relaxed fit and drop-shoulder silhouette. Comfortable enough for every day. Bold enough for every room.",
    price: 950,
    category: "hoodies",
    tag: "Essential",
    collectionId: "hoodies",
    variants: [
      {
        id: "midnight-black",
        colorName: "Midnight Black",
        colorHex: "#1a1a1a",
        images: [
          "/collections/hoodies/hoodieBlackMan.jpg",
          "/collections/hoodies/hoodieManXMan.jpg",
        ],
        sizes: [
          { size: "S", stock: 6 },
          { size: "M", stock: 12 },
          { size: "L", stock: 10 },
          { size: "XL", stock: 4 },
          { size: "XXL", stock: 1 },
        ],
      },
      {
        id: "multi-color",
        colorName: "Multi Color",
        colorHex: "#c0392b",
        images: ["/collections/hoodies/hoodieColors.jpg"],
        sizes: [
          { size: "S", stock: 3 },
          { size: "M", stock: 5 },
          { size: "L", stock: 4 },
          { size: "XL", stock: 2 },
          { size: "XXL", stock: 0 },
        ],
      },
    ],
    details: [
      "480gsm heavyweight French terry cotton",
      "Drop-shoulder relaxed fit",
      "Kangaroo pouch pocket",
      "Ribbed cuffs and hem",
      "Embroidered chest logo",
    ],
    careInstructions: [
      "Machine wash cold inside out",
      "Tumble dry low",
      "Do not bleach",
      "Do not iron directly on graphic",
    ],
  },

  // ── SUNGLASSES ─────────────────────────────────────────────────────────────
  {
    id: "outlaw-i",
    slug: "outlaw-i",
    name: "Outlaw I",
    description:
      "Built for those who move through the world on their own terms. Oversized black frames with UV400 polarized lenses. Lightweight stainless steel hinges ensure an all-day fit.",
    price: 1200,
    category: "sunglasses",
    tag: "Signature",
    collectionId: "sunglasses",
    variants: [
      {
        id: "black",
        colorName: "Black",
        colorHex: "#111111",
        images: ["/collections/glases/outlawGlasses1.jpg"],
        sizes: [{ size: "One Size", stock: 10 }],
      },
    ],
    details: [
      "UV400 polarized lenses",
      "Lightweight stainless steel frame",
      "Anti-reflective coating",
      "One size fits most",
    ],
    careInstructions: [
      "Clean with microfiber cloth only",
      "Store in protective case",
      "Avoid extreme heat",
    ],
  },
  {
    id: "obsidian-lens",
    slug: "obsidian-lens",
    name: "Obsidian Lens",
    description:
      "Obsidian Lens channels pure confidence. Deep-tinted lenses in a sculpted rectangular frame. A statement piece that demands no explanation.",
    price: 1350,
    category: "sunglasses",
    tag: "Statement",
    collectionId: "sunglasses",
    variants: [
      {
        id: "black",
        colorName: "Black",
        colorHex: "#111111",
        images: [
          "/collections/glases/outlawGlasses3.jpg",
          "/collections/glases/outlawGlasses5.jpg",
        ],
        sizes: [{ size: "One Size", stock: 8 }],
      },
    ],
    details: [
      "Deep-tinted polarized lenses",
      "Sculpted rectangular acetate frame",
      "UV400 protection",
      "Stainless steel hinges",
    ],
    careInstructions: [
      "Clean with microfiber cloth only",
      "Store in protective case",
      "Avoid extreme heat",
    ],
  },
  {
    id: "eclipse-edit",
    slug: "eclipse-edit",
    name: "Eclipse Edit",
    description:
      "Limited production. The Eclipse features a wraparound silhouette with mirrored lenses that reflect everything the world throws at you. Literally.",
    price: 1180,
    category: "sunglasses",
    tag: "Limited",
    collectionId: "sunglasses",
    variants: [
      {
        id: "mirrored",
        colorName: "Mirrored Black",
        colorHex: "#2c2c2c",
        images: ["/collections/glases/outlawGlases4.jpg"],
        sizes: [{ size: "One Size", stock: 5 }],
      },
    ],
    details: [
      "Mirrored polarized lenses",
      "Wraparound silhouette",
      "UV400 protection",
      "Limited production run",
    ],
    careInstructions: [
      "Clean with microfiber cloth only",
      "Store in protective case",
      "Avoid extreme heat",
    ],
  },
  {
    id: "sovereign-shades",
    slug: "sovereign-shades",
    name: "Sovereign Shades",
    description:
      "Designed for the woman who has already decided. Sleek cat-eye geometry, polarized lenses, and a feather-light frame that disappears on the face.",
    price: 980,
    category: "sunglasses",
    tag: "Womens",
    collectionId: "sunglasses",
    variants: [
      {
        id: "black",
        colorName: "Black",
        colorHex: "#111111",
        images: [
          "/collections/glases/shadesFemale.jpg",
          "/collections/glases/shadesFemale2.jpg",
        ],
        sizes: [{ size: "One Size", stock: 12 }],
      },
    ],
    details: [
      "Cat-eye silhouette",
      "Feather-light titanium frame",
      "Polarized gradient lenses",
      "UV400 protection",
    ],
    careInstructions: [
      "Clean with microfiber cloth only",
      "Store in protective case",
      "Avoid extreme heat",
    ],
  },

  // ── TOPS ───────────────────────────────────────────────────────────────────
  {
    id: "revolt-oversized-tee",
    slug: "revolt-oversized-tee",
    name: "Revolt Oversized Tee",
    description:
      "Heavyweight cotton, drop-shoulder cut, uncompromising attitude. The Revolt Tee is a canvas for those who move through the world on their own frequency.",
    price: 580,
    category: "tops",
    tag: "Mens",
    collectionId: "tops",
    variants: [
      {
        id: "washed-black",
        colorName: "Washed Black",
        colorHex: "#2a2a2a",
        images: ["/collections/men_shirt/shirtCollection.jpeg"],
        sizes: [
          { size: "XS", stock: 5 },
          { size: "S", stock: 12 },
          { size: "M", stock: 18 },
          { size: "L", stock: 14 },
          { size: "XL", stock: 7 },
        ],
      },
    ],
    details: [
      "320gsm heavyweight cotton",
      "Drop-shoulder oversized fit",
      "Raw-edge hem detail",
      "Embroidered chest logo",
    ],
    careInstructions: [
      "Machine wash cold inside out",
      "Tumble dry low",
      "Do not bleach or iron on logo",
    ],
  },
  {
    id: "phantom-long-sleeve",
    slug: "phantom-long-sleeve",
    name: "Phantom Long Sleeve",
    description:
      "Clean lines, deliberate presence. The Phantom Long Sleeve is tailored for those who move through rooms and leave something behind. A feeling, a memory, a standard.",
    price: 720,
    category: "tops",
    tag: "Womens",
    collectionId: "tops",
    variants: [
      {
        id: "warm-brown",
        colorName: "Warm Brown",
        colorHex: "#7a5c4d",
        images: ["/collections/female_shirts/shirtBrown.jpeg"],
        sizes: [
          { size: "XS", stock: 6 },
          { size: "S", stock: 10 },
          { size: "M", stock: 13 },
          { size: "L", stock: 8 },
          { size: "XL", stock: 3 },
        ],
      },
    ],
    details: [
      "Stretch modal blend",
      "Fitted long-sleeve silhouette",
      "Subtle tonal logo print",
      "Ribbed cuffs and hem",
    ],
    careInstructions: [
      "Machine wash cold gentle cycle",
      "Lay flat to dry",
      "Do not bleach",
    ],
  },
  {
    id: "sovereign-crop",
    slug: "sovereign-crop",
    name: "Sovereign Crop",
    description:
      "The crop for those who own their silhouette. Soft French terry fabric, structured crop hem, and that unmistakable Unapologetic energy woven into every detail.",
    price: 650,
    category: "tops",
    tag: "Womens",
    collectionId: "tops",
    variants: [
      {
        id: "soft-cream",
        colorName: "Soft Cream",
        colorHex: "#f5f0e8",
        images: ["/collections/female_shirts/shirtCream.jpeg"],
        sizes: [
          { size: "XS", stock: 8 },
          { size: "S", stock: 11 },
          { size: "M", stock: 9 },
          { size: "L", stock: 5 },
          { size: "XL", stock: 2 },
        ],
      },
    ],
    details: [
      "Soft French terry cotton",
      "Structured cropped hem",
      "Wide-rib crew neck",
      "Embroidered logo",
    ],
    careInstructions: [
      "Machine wash cold",
      "Lay flat to dry",
      "Do not bleach or iron on logo",
    ],
  },

  // ── LINGERIE ───────────────────────────────────────────────────────────────
  {
    id: "soft-power-set",
    slug: "soft-power-set",
    name: "Soft Power Set",
    description:
      "What you wear beneath says everything about how you carry yourself. The Soft Power Set is luxury intimate wear for those who move through the world knowing exactly who they are.",
    price: 680,
    category: "lingerie",
    tag: "Signature",
    collectionId: "lingerie",
    variants: [
      {
        id: "midnight-black",
        colorName: "Midnight Black",
        colorHex: "#1a1a1a",
        images: ["/collections/female_undergarments/lingerie.jpeg"],
        sizes: [
          { size: "XS", stock: 4 },
          { size: "S", stock: 8 },
          { size: "M", stock: 10 },
          { size: "L", stock: 6 },
          { size: "XL", stock: 2 },
        ],
      },
    ],
    details: [
      "Stretch lace and mesh construction",
      "Adjustable straps",
      "Soft-touch lining",
      "Minimal branding",
    ],
    careInstructions: [
      "Hand wash cold with mild detergent",
      "Do not tumble dry",
      "Lay flat to dry",
      "Do not bleach",
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS — mirror what a real API would expose
// ─────────────────────────────────────────────────────────────────────────────

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return PRODUCTS.filter(
    (p) => p.category === product.category && p.slug !== product.slug,
  ).slice(0, limit);
}

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(PRODUCTS.map((p) => p.category)));
}
