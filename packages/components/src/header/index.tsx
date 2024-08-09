import { faBars } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ReactNode } from "react";
import { AssetImage } from "../asset-image";
import { Button } from "../ui/button";
import { Flex } from "../ui/flex";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { HeaderProgress } from "./header-progress";
import { NavItem } from "./nav-item";

interface HeaderProps {
  mobileBreadcrumbs?: ReactNode;
  breadcrumbs?: ReactNode;
  subnav?: ReactNode;
  addons?: ReactNode;
  links?: ReactNode;
  suffix?: ReactNode;
  logo?: ReactNode;
}

export function Header({
  breadcrumbs,
  subnav,
  mobileBreadcrumbs,
  addons,
  links,
  suffix,
  logo,
}: HeaderProps) {
  return (
    <header className="bg-background/60 sticky top-0 z-10 flex flex-col items-center border-b py-2 backdrop-blur">
      {addons}
      <div className="w-full px-8 flex min-h-10 flex-col justify-center gap-4">
        <div className="flex w-full items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <FontAwesomeIcon icon={faBars} className="size-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid min-h-full gap-6 text-lg font-medium">
                <div className="flex-1">
                  <Flex direction="col" gap="6">
                    <a
                      href="/"
                      className="flex items-center gap-2 text-lg font-semibold"
                    >
                      <AssetImage
                        className="h-6"
                        src="/logo/cream.svg"
                        alt="Rivet logo"
                      />
                    </a>
                    {mobileBreadcrumbs}
                  </Flex>
                </div>
                <Flex direction="col" justify="end" gap="6">
                  <NavItem asChild>
                    <a
                      href="https://rivet.gg/docs"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Docs
                    </a>
                  </NavItem>
                  <NavItem asChild>
                    <a
                      href="https://rivet.gg/support"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Support
                    </a>
                  </NavItem>
                </Flex>
              </nav>
            </SheetContent>
          </Sheet>
          <nav className="flex-1 font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            {logo ? (
              logo
            ) : (
              <a href="/">
                <AssetImage
                  className="h-6"
                  alt="Rivet Logo"
                  src="/logo/cream.svg"
                />
              </a>
            )}
            {breadcrumbs ? (
              <div className="hidden md:flex">{breadcrumbs}</div>
            ) : null}
          </nav>
          <div className="gap-6 font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm">
            {links}
          </div>
        </div>
        {subnav}
      </div>
      {suffix}
    </header>
  );
}

Header.NavItem = NavItem;
Header.Progress = HeaderProgress;
