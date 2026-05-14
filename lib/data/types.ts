export type ProductColor = {
  name: string;
  hex: string;
  image?: string; // optional variant image shown when this color is selected
};

export type Product = {
  id: string; // e.g. "boxers-1"
  name: string;
  description: string;
  price: string; // display string "US$45"
  priceNum: number;
  images: string[]; // all images; first is primary / cover
  colors?: ProductColor[];
  tag: string; // "Essential", "Signature", etc.
  collectionId: string; // matches Collection.id
};

export type Collection = {
  id: string;
  subtitle: string; // e.g. "Sunglasses"
  title: string; // e.g. "The Eclipse Edit"
  tagline: string;
  featured: string; // hero / cover image path
  href: string; // e.g. "/collections/sunglasses"
  products: Product[];
};

export type OverviewCard = {
  /** Matches the section id on the collections page for scroll-to behaviour */
  id: string;
  label: string;
  img: string;
  description: string;
};
