import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, type ButtonProps, cn } from "@rivet-gg/components";
import { type ReactNode, useContext } from "react";
import { MobileBreadcrumbsContext } from "../breadcrumbs/mobile-breadcrumbs";

export interface HeaderLinkProps extends ButtonProps {
  icon?: IconProp;
  children?: ReactNode;
}

export function HeaderLink({ icon, children, ...props }: HeaderLinkProps) {
  const isMobile = useContext(MobileBreadcrumbsContext);

  return (
    <Button
      asChild
      variant="ghost"
      {...props}
      className={cn(
        isMobile &&
          "text-muted-foreground hover:text-foreground text-lg data-active:text-foreground",
        !isMobile &&
          "relative text-muted-foreground data-active:text-foreground data-active:after:content-[''] rounded-b-none data-active:after:absolute data-active:after:bottom-0 data-active:after:left-0 data-active:after:right-0 data-active:after:h-[2px] data-active:after:bg-primary",
        props.className,
      )}
      startIcon={
        icon ? (
          <FontAwesomeIcon
            className={cn("size-5", isMobile && "size-4")}
            icon={icon}
          />
        ) : undefined
      }
    >
      {children}
    </Button>
  );
}
