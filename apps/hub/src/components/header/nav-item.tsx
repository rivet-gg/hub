import { Slot } from "@radix-ui/react-slot";
import { cn } from "@rivet-gg/components";
import type { PropsWithChildren } from "react";

interface NavItemProps extends PropsWithChildren<JSX.IntrinsicElements["a"]> {
  asChild?: boolean;
}

export const NavItem = ({ className, asChild, ...props }: NavItemProps) => {
  const Comp = asChild ? Slot : "a";
  return (
    <Comp
      className={cn(
        className,
        "text-muted-foreground hover:text-foreground transition-colors",
      )}
      {...props}
    />
  );
};
