import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cn } from "../lib/utils";
import {
  type CommonHelperProps,
  getCommonHelperClass,
  omitCommonHelperProps,
} from "./helpers";

const buttonVariants = cva(
  "group group/button inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:z-10 relative disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "border button-secondary bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends VariantProps<typeof buttonVariants>,
    Partial<CommonHelperProps>,
    React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean;
  isLoading?: boolean;
  endIcon?: React.ReactElement;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild,
      className,
      variant,
      size,
      isLoading,
      endIcon,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const C = asChild ? Slot : "button";

    return (
      <C
        className={cn(
          buttonVariants({ variant, size, className }),
          getCommonHelperClass(props),
        )}
        ref={ref}
        {...omitCommonHelperProps(props)}
        disabled={isLoading || disabled}
      >
        {isLoading ? (
          <FontAwesomeIcon
            icon={faSpinnerThird}
            className={cn("h-4 w-4 animate-spin", size !== "icon" && "mr-2")}
          />
        ) : null}
        {size === "icon" && isLoading ? null : (
          <Slottable>{children}</Slottable>
        )}
        {endIcon ? React.cloneElement(endIcon, { className: "ml-2" }) : null}
      </C>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
