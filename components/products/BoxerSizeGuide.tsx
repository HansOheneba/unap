"use client";

import ProductSizeGuide from "./ProductSizeGuide";

export { isBoxerCollection } from "@/lib/size-guides";

type Props = {
  variant?: "button" | "link";
};

/** @deprecated Prefer ProductSizeGuide. Defaults to the boxers chart. */
export default function BoxerSizeGuide({ variant = "button" }: Props) {
  return <ProductSizeGuide variant={variant} guideKey="boxers" />;
}
