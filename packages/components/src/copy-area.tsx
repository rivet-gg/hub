import { faCopy } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Slot } from "@radix-ui/react-slot";
import { type ReactNode, forwardRef, useState } from "react";
import { toast } from "sonner";
import { cn } from "./lib/utils";
import { Button, type ButtonProps } from "./ui/button";
import { Flex } from "./ui/flex";
import { Input } from "./ui/input";
import { WithTooltip } from "./ui/tooltip";

interface CopyAreaProps {
  className?: string;
  value: string;
  display?: string;
  isConfidential?: boolean;
  variant?: "default" | "discrete";
  size?: ButtonProps["size"];
}

export const CopyArea = forwardRef<HTMLButtonElement, CopyAreaProps>(
  (
    {
      value,
      className,
      isConfidential,
      display,
      variant = "default",
      ...props
    },
    ref,
  ) => {
    const [isRevealed, setIsRevealed] = useState(false);
    const handleClick = () => {
      navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard");
    };

    if (variant === "discrete") {
      return (
        <Button
          ref={ref}
          className={cn("font-mono", className)}
          variant="outline"
          type="button"
          endIcon={
            <FontAwesomeIcon
              className="group-hover/button:opacity-100 opacity-0 transition-opacity"
              icon={faCopy}
            />
          }
          {...props}
          onClick={handleClick}
        >
          <span className="flex-1 text-left truncate">{display || value}</span>
        </Button>
      );
    }

    return (
      <Flex gap="2" className={cn(className)} {...props}>
        {isConfidential ? (
          <WithTooltip
            content="Click to reveal"
            trigger={
              <Input
                readOnly
                value={display || value}
                onFocus={() => setIsRevealed(true)}
                onBlur={() => setIsRevealed(false)}
                className="font-mono"
                type={isRevealed ? "text" : "password"}
              />
            }
          />
        ) : (
          <Input
            readOnly
            value={display || value}
            className="font-mono"
            type="text"
          />
        )}

        <Button variant="secondary" size="icon" onClick={handleClick}>
          <FontAwesomeIcon icon={faCopy} />
        </Button>
      </Flex>
    );
  },
);

interface CopyButtonProps {
  children: ReactNode;
  value: string;
}

export function CopyButton({ children, value }: CopyButtonProps) {
  const handleClick = () => {
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };
  return <Slot onClick={handleClick}>{children}</Slot>;
}
