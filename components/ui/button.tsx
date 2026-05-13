import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center border bg-clip-padding whitespace-nowrap transition-colors duration-300 outline-none select-none focus-visible:ring-2 focus-visible:ring-black/20 disabled:pointer-events-none disabled:opacity-50 text-[0.7rem] tracking-widest uppercase px-8 py-3 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-black bg-black text-white hover:bg-white hover:text-black hover:border-black",
        outline:
          "border-black bg-transparent text-black hover:bg-black hover:text-white",
        "outline-white":
          "border-white bg-transparent text-white hover:bg-white hover:text-black",
        secondary:
          "border-zinc-200 bg-transparent text-zinc-600 hover:border-zinc-400 hover:text-zinc-900",
        ghost:
          "border-transparent bg-transparent text-zinc-700 hover:bg-zinc-50",
        destructive:
          "border-red-500/40 bg-transparent text-red-500 hover:bg-red-500 hover:text-white",
        link: "border-transparent bg-transparent text-zinc-900 underline-offset-4 hover:underline px-0 py-0",
      },
      size: {
        default: "px-8 py-3",
        xs: "px-4 py-1.5 text-[0.65rem]",
        sm: "px-6 py-2",
        lg: "px-10 py-4",
        icon: "size-9 px-0 py-0 tracking-normal",
        "icon-xs": "size-6 px-0 py-0 tracking-normal",
        "icon-sm": "size-7 px-0 py-0 tracking-normal",
        "icon-lg": "size-11 px-0 py-0 tracking-normal",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
