"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useWishlistStore,
  type WishlistItem,
} from "@/lib/stores/wishlist-store";
import { useIsLoggedIn } from "@/lib/use-is-logged-in";
import { cn } from "@/lib/utils";

type Props = {
  item: WishlistItem;
  className?: string;
  size?: number;
};

export default function WishlistButton({ item, className, size = 14 }: Props) {
  const router = useRouter();
  const isLoggedIn = useIsLoggedIn();
  const wishlisted = useWishlistStore((s) =>
    s.items.some((i) => i.id === item.id),
  );
  const toggle = useWishlistStore((s) => s.toggle);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isLoggedIn) {
          router.push(
            "/auth/login?next=" + encodeURIComponent(window.location.pathname),
          );
          return;
        }
        toggle(item);
      }}
      aria-label={
        !isLoggedIn
          ? "Sign in to save to wishlist"
          : wishlisted
            ? "Remove from wishlist"
            : "Add to wishlist"
      }
      className={cn(
        "flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200",
        wishlisted
          ? "bg-white text-red-500 shadow-sm"
          : "bg-black/40 backdrop-blur-sm text-white hover:bg-white hover:text-zinc-900",
        className,
      )}
    >
      <Heart
        size={size}
        strokeWidth={2}
        className={wishlisted ? "fill-current" : ""}
      />
    </button>
  );
}
