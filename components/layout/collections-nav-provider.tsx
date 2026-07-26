"use client";

import { createContext, useContext } from "react";
import type { CollectionNavItem } from "@/lib/collections-nav";

const CollectionsNavContext = createContext<CollectionNavItem[]>([]);

export function CollectionsNavProvider({
  items,
  children,
}: {
  items: CollectionNavItem[];
  children: React.ReactNode;
}) {
  return (
    <CollectionsNavContext.Provider value={items}>
      {children}
    </CollectionsNavContext.Provider>
  );
}

export function useCollectionsNav(): CollectionNavItem[] {
  return useContext(CollectionsNavContext);
}
