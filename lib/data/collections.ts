import type { Collection } from "./types";

export const DEFAULT_COLLECTIONS: Collection[] = [
  // ── SUNGLASSES ────────────────────────────────────────────────────────────
  {
    id: "sunglasses",
    subtitle: "Sunglasses",
    title: "The Eclipse Edit",
    tagline:
      "The world looks different when you stop apologizing for the view.",
    featured: "/collections/glases/outlawGlasses1.jpg",
    href: "/collections/sunglasses",
    products: [
      {
        id: "sunglasses-1",
        name: "Outlaw I",
        description:
          "The Outlaw I is built for those who move through the world on their own terms. Oversized black frames with UV400 polarized lenses. Lightweight stainless steel hinges ensure an all-day fit.",
        price: "US$145",
        priceNum: 145,
        images: ["/collections/glases/outlawGlasses1.jpg"],
        tag: "Signature",
        collectionId: "sunglasses",
      },
      {
        id: "sunglasses-2",
        name: "Obsidian Lens",
        description:
          "Obsidian Lens channels pure confidence. Deep-tinted lenses in a sculpted rectangular frame. A statement piece that demands no explanation.",
        price: "US$160",
        priceNum: 160,
        images: ["/collections/glases/outlawGlasses3.jpg"],
        tag: "Statement",
        collectionId: "sunglasses",
      },
      {
        id: "sunglasses-3",
        name: "Outlaw III",
        description:
          "Classic proportions meet Unapologetic attitude. The Outlaw III is a daily driver — bold enough to be noticed, clean enough to go anywhere.",
        price: "US$135",
        priceNum: 135,
        images: ["/collections/glases/outlawGlases4.jpg"],
        tag: "Classic",
        collectionId: "sunglasses",
      },
      {
        id: "sunglasses-4",
        name: "Eclipse",
        description:
          "Limited production. The Eclipse features a wraparound silhouette with mirrored lenses that reflect everything the world throws at you — literally.",
        price: "US$150",
        priceNum: 150,
        images: ["/collections/glases/outlawGlasses5.jpg"],
        tag: "Limited",
        collectionId: "sunglasses",
      },
      {
        id: "sunglasses-5",
        name: "Sovereign",
        description:
          "Designed for the woman who has already decided. Sleek cat-eye geometry, polarized lenses, and a feather-light frame that disappears on the face.",
        price: "US$125",
        priceNum: 125,
        images: ["/collections/glases/shadesFemale.jpg"],
        tag: "Womens",
        collectionId: "sunglasses",
      },
      {
        id: "sunglasses-6",
        name: "Sovereign II",
        description:
          "A refined variation on the Sovereign silhouette. Subtle gradient lenses on a wider frame — made for the ones who refuse to blend in.",
        price: "US$125",
        priceNum: 125,
        images: ["/collections/glases/shadesFemale2.jpg"],
        tag: "Womens",
        collectionId: "sunglasses",
      },
      {
        id: "sunglasses-7",
        name: "Obsidian (Womens)",
        description:
          "Full black, full presence. The Obsidian Womens edition wraps the face in bold geometry — for every room you walk into and own.",
        price: "US$135",
        priceNum: 135,
        images: ["/collections/glases/shadesFemale3.jpg"],
        tag: "Womens",
        collectionId: "sunglasses",
      },
      {
        id: "sunglasses-8",
        name: "Eclipse (Womens)",
        description:
          "The Eclipse in a feminine silhouette. Oversize frames, gradient lenses. Because some of us were born to be seen.",
        price: "US$135",
        priceNum: 135,
        images: ["/collections/glases/shadesFemale4.jpg"],
        tag: "Womens",
        collectionId: "sunglasses",
      },
    ],
  },

  // ── HEADWEAR ──────────────────────────────────────────────────────────────
  {
    id: "headwear",
    subtitle: "Head Wears",
    title: "Bold Society",
    tagline:
      "A statement for those who stopped asking for a seat at the table.",
    featured: "/collections/headwear/boldSocietyCapBlack.jpeg",
    href: "/collections/headwear",
    products: [
      {
        id: "headwear-1",
        name: "Bold Society Black",
        description:
          "Six-panel structured cap. The Bold Society wordmark sits clean on washed cotton. All-black everything — for the ones who lead without announcing it.",
        price: "US$65",
        priceNum: 65,
        images: [
          "/collections/headwear/boldSocietyCapBlack.jpeg",
          "/collections/headwear/boldSocietyCapBlack2.jpeg",
          "/collections/headwear/boldSocietyCapBlack3.jpeg",
        ],
        colors: [
          { name: "Black", hex: "#1a1a1a" },
          { name: "Cream", hex: "#f5f0e8" },
          { name: "Red", hex: "#c41e3a" },
        ],
        tag: "Signature",
        collectionId: "headwear",
      },
      {
        id: "headwear-2",
        name: "Bold Society Cream",
        description:
          "The same structured silhouette in a warm cream wash. Pairs effortlessly with the full Unapologetic range — and everything else you own.",
        price: "US$65",
        priceNum: 65,
        images: [
          "/collections/headwear/boldSocietyCapCream.jpeg",
          "/collections/headwear/boldSocietyCapCream2.jpeg",
          "/collections/headwear/boldSocietyCapCream3.jpeg",
        ],
        colors: [
          { name: "Black", hex: "#1a1a1a" },
          { name: "Cream", hex: "#f5f0e8" },
          { name: "Red", hex: "#c41e3a" },
        ],
        tag: "Classic",
        collectionId: "headwear",
      },
      {
        id: "headwear-3",
        name: "Bold Society Red",
        description:
          "Bold Society in crimson. For the days when subtlety isn't the assignment. Same six-panel construction, same conviction.",
        price: "US$65",
        priceNum: 65,
        images: [
          "/collections/headwear/boldSocietyCapRed.jpeg",
          "/collections/headwear/boldSocietyCapRed2.jpeg",
          "/collections/headwear/boldSocietyCapRed3.jpeg",
          "/collections/headwear/boldSocietyCapRed4.jpeg",
          "/collections/headwear/boldSocietyCapRed5.jpeg",
        ],
        colors: [
          { name: "Black", hex: "#1a1a1a" },
          { name: "Cream", hex: "#f5f0e8" },
          { name: "Red", hex: "#c41e3a" },
        ],
        tag: "Bold",
        collectionId: "headwear",
      },
      {
        id: "headwear-4",
        name: "Suede Cap Black",
        description:
          "Premium suede brim with a clean unstructured crown. Tactile, quiet luxury for the ones who feel the difference.",
        price: "US$75",
        priceNum: 75,
        images: [
          "/collections/headwear/suedeCapBlack.jpg",
          "/collections/headwear/suedeCapBlack2.jpeg",
        ],
        tag: "Premium",
        collectionId: "headwear",
      },
      {
        id: "headwear-5",
        name: "Sovereign Beanie",
        description:
          "Fine-knit ribbed beanie. Heavyweight enough to mean it, clean enough to wear anywhere. The Sovereign wordmark is debossed on a woven patch.",
        price: "US$55",
        priceNum: 55,
        images: ["/collections/headwear/beanie.jpg"],
        colors: [
          { name: "Black", hex: "#1a1a1a" },
          { name: "Red", hex: "#c41e3a" },
        ],
        tag: "Essential",
        collectionId: "headwear",
      },
      {
        id: "headwear-6",
        name: "Sovereign Beanie Red",
        description:
          "The Sovereign Beanie in a bold crimson knit. Same structure, same conviction — different declaration.",
        price: "US$55",
        priceNum: 55,
        images: [
          "/collections/headwear/beanieRed.jpg",
          "/collections/headwear/beanieRed2.jpg",
        ],
        colors: [
          { name: "Black", hex: "#1a1a1a" },
          { name: "Red", hex: "#c41e3a" },
        ],
        tag: "Bold",
        collectionId: "headwear",
      },
    ],
  },

  // ── TOPS ──────────────────────────────────────────────────────────────────
  {
    id: "tops",
    subtitle: "Tops",
    title: "The Anti-Uniform",
    tagline: "Move in silence. Let the fabric do the talking.",
    featured: "/collections/men_shirt/shirtCollection.jpeg",
    href: "/collections/tops",
    products: [
      {
        id: "tops-1",
        name: "Revolt Oversized Tee",
        description:
          "Heavyweight 320gsm cotton in an oversized silhouette that wears like a second skin. Chest-embroidered Unapologetic wordmark. Pre-washed for immediate comfort.",
        price: "US$85",
        priceNum: 85,
        images: ["/collections/men_shirt/shirtCollection.jpeg"],
        colors: [
          { name: "Black", hex: "#1a1a1a" },
          { name: "White", hex: "#f9f9f7" },
          { name: "Slate", hex: "#6b7280" },
        ],
        tag: "Mens",
        collectionId: "tops",
      },
      {
        id: "tops-2",
        name: "Phantom Long Sleeve Brown",
        description:
          "Midweight long-sleeve in a warm earthy brown. Relaxed through the body with a slightly dropped shoulder. The kind of piece that works for everything and asks nothing.",
        price: "US$110",
        priceNum: 110,
        images: ["/collections/female_shirts/shirtBrown.jpeg"],
        tag: "Womens",
        collectionId: "tops",
      },
      {
        id: "tops-3",
        name: "Sovereign Crop Cream",
        description:
          "Cropped and intentional. The Sovereign Crop sits just above the waist in a clean cream knit. Subtle logo at the hem. For those who dress with purpose.",
        price: "US$95",
        priceNum: 95,
        images: ["/collections/female_shirts/shirtCream.jpeg"],
        tag: "Womens",
        collectionId: "tops",
      },
    ],
  },

  // ── INTIMATES / BOXERS ────────────────────────────────────────────────────
  {
    id: "boxers",
    subtitle: "Intimates & Boxers",
    title: "Beneath The Surface",
    tagline: "Confidence starts where no one else can see.",
    featured: "/collections/boxers/boxersMixed.jpeg",
    href: "/collections/boxers",
    products: [
      {
        id: "boxers-1",
        name: "Classic White",
        description:
          "The essential. Pure white boxer brief in a modal-cotton blend that stays cool all day. Flat-lock seams, no-roll waistband. The foundation of any wardrobe that takes itself seriously.",
        price: "US$45",
        priceNum: 45,
        images: [
          "/collections/boxers/boxersWhite.jpeg",
          "/collections/boxers/boxersWhite2.jpeg",
          "/collections/boxers/boxModel.jpg",
        ],
        tag: "Essential",
        collectionId: "boxers",
      },
      {
        id: "boxers-2",
        name: "Midnight Blue",
        description:
          "Deep navy modal-cotton. The Midnight Blue is for the ones who know that the details others never see matter most. Anti-fade dye treatment.",
        price: "US$45",
        priceNum: 45,
        images: [
          "/collections/boxers/boxersBlue.jpg",
          "/collections/boxers/boxersBlue2.jpg",
          "/collections/boxers/boxModel.jpg",
        ],
        tag: "Statement",
        collectionId: "boxers",
      },
      {
        id: "boxers-3",
        name: "Bourbon Brown",
        description:
          "Warm, earthy, unapologetic. The Bourbon Brown boxer brief in a rich tonal brown with a contrast waistband. Modal-cotton blend for all-day comfort.",
        price: "US$45",
        priceNum: 45,
        images: [
          "/collections/boxers/boxersBrown.jpeg",
          "/collections/boxers/boxersBrown2.jpeg",
          "/collections/boxers/boxModel.jpg",
        ],
        tag: "Signature",
        collectionId: "boxers",
      },
      {
        id: "boxers-4",
        name: "Storm Gray",
        description:
          "Understated and precise. Storm Gray lives in the space between formal and free. The daily uniform for those who move with quiet intention.",
        price: "US$45",
        priceNum: 45,
        images: [
          "/collections/boxers/boxersGray.jpg",
          "/collections/boxers/boxersGray2.jpg",
          "/collections/boxers/boxModel.jpg",
        ],
        tag: "Classic",
        collectionId: "boxers",
      },
      {
        id: "boxers-5",
        name: "Ivory",
        description:
          "Warm ivory in a lightweight fabric blend. Limited in production. For those with a refined eye for what most people overlook.",
        price: "US$45",
        priceNum: 45,
        images: [
          "/collections/boxers/boxersCream.jpeg",
          "/collections/boxers/boxersCream2.jpeg",
          "/collections/boxers/boxModel.jpg",
        ],
        tag: "Limited",
        collectionId: "boxers",
      },
      {
        id: "boxers-6",
        name: "Monochrome",
        description:
          "Black and white. No compromise, no ambiguity. The Monochrome boxer brief features a contrast waistband and bold colorblock design.",
        price: "US$45",
        priceNum: 45,
        images: [
          "/collections/boxers/boxersBlackWhite.jpeg",
          "/collections/boxers/boxersBlackWhite2.jpeg",
          "/collections/boxers/boxModel.jpg",
        ],
        tag: "Bold",
        collectionId: "boxers",
      },
      {
        id: "boxers-7",
        name: "The Full Set",
        description:
          "All six colorways. One box. The Full Set is for those who commit fully. Free engraved box included.",
        price: "US$240",
        priceNum: 240,
        images: [
          "/collections/boxers/boxersMixed.jpeg",
          "/collections/boxers/boxersSizeChart.jpg",
        ],
        tag: "Bundle",
        collectionId: "boxers",
      },
    ],
  },

  // ── TRACKS ────────────────────────────────────────────────────────────────
  {
    id: "tracks",
    subtitle: "Tracks",
    title: "In Motion",
    tagline:
      "Movement is not optional. Neither is the standard you carry while doing it.",
    featured: "/collections/tracks/track.jpg",
    href: "/collections/tracks",
    products: [
      {
        id: "tracks-1",
        name: "Sovereign Track",
        description:
          "Technical jersey tracksuit with tapered joggers and a zip-through jacket. Reflective Unapologetic branding. Built for the ones who train as hard as they think.",
        price: "US$120",
        priceNum: 120,
        images: ["/collections/tracks/track.jpg"],
        colors: [
          { name: "Black", hex: "#1a1a1a" },
          { name: "Navy", hex: "#1e3a5f" },
        ],
        tag: "Signature",
        collectionId: "tracks",
      },
      {
        id: "tracks-2",
        name: "Sovereign Track II",
        description:
          "The second iteration of the Sovereign Track. Same precision construction, updated silhouette with side-zip pockets and a longer jacket hem.",
        price: "US$120",
        priceNum: 120,
        images: ["/collections/tracks/track2.jpg"],
        colors: [
          { name: "Black", hex: "#1a1a1a" },
          { name: "Charcoal", hex: "#374151" },
        ],
        tag: "Limited",
        collectionId: "tracks",
      },
    ],
  },

  // ── HOODIES ───────────────────────────────────────────────────────────────
  {
    id: "hoodies",
    subtitle: "Hoodies",
    title: "Sovereign Warmth",
    tagline: "The weight on your back should feel like armor, not obligation.",
    featured: "/collections/hoodies/hoodieBlackMan.jpg",
    href: "/collections/hoodies",
    products: [
      {
        id: "hoodies-1",
        name: "Sovereign Hoodie",
        description:
          "500gsm French terry hoodie with a kangaroo pocket and a slightly oversized fit. Heavyweight enough to hold its shape, premium enough to justify the weight.",
        price: "US$135",
        priceNum: 135,
        images: ["/collections/hoodies/hoodieBlackMan.jpg"],
        colors: [
          { name: "Black", hex: "#1a1a1a" },
          { name: "Multi", hex: "#6b4c9a" },
        ],
        tag: "Signature",
        collectionId: "hoodies",
      },
      {
        id: "hoodies-2",
        name: "Spectrum Hoodie",
        description:
          "The Spectrum is for those who refuse to be one thing. A bold multi-tone dye treatment on the same heavyweight French terry base. No two pieces finish exactly the same.",
        price: "US$135",
        priceNum: 135,
        images: ["/collections/hoodies/hoodieColors.jpg"],
        tag: "Statement",
        collectionId: "hoodies",
      },
      {
        id: "hoodies-3",
        name: "Rebel Hoodie",
        description:
          "Two people, one vision. The Rebel Hoodie was designed for the ones who move in pairs but think for themselves. Extended hem, split ribbed cuffs.",
        price: "US$140",
        priceNum: 140,
        images: ["/collections/hoodies/hoodieManXMan.jpg"],
        tag: "Limited",
        collectionId: "hoodies",
      },
    ],
  },

  // ── LINGERIE ──────────────────────────────────────────────────────────────
  {
    id: "lingerie",
    subtitle: "Lingerie",
    title: "Soft Power",
    tagline:
      "What you wear beneath says everything about how you carry yourself.",
    featured: "/collections/female_undergarments/lingerie.jpeg",
    href: "/collections/lingerie",
    products: [
      {
        id: "lingerie-1",
        name: "Soft Power Set",
        description:
          "A two-piece set in sheer, structured lace. The Soft Power Set is crafted for the woman who understands that restraint and boldness are the same force, aimed differently.",
        price: "US$95",
        priceNum: 95,
        images: ["/collections/female_undergarments/lingerie.jpeg"],
        colors: [
          { name: "Noir", hex: "#1a1a1a" },
          { name: "Blush", hex: "#e8c4b8" },
          { name: "Ivory", hex: "#f5f0e8" },
        ],
        tag: "Signature",
        collectionId: "lingerie",
      },
    ],
  },
];
