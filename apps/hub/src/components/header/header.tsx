import { useAuth } from "@/domains/auth/contexts/auth";
import { faBars } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  AssetImage,
  Button,
  Flex,
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@rivet-gg/components";
import { Link } from "@tanstack/react-router";
import { Breadcrumbs } from "../breadcrumbs/breadcrumbs";
import { MobileBreadcrumbs } from "../breadcrumbs/mobile-breadcrumbs";
import { CommandPanel } from "../command-panel";
import { HeaderRouteLoader } from "./header-route-loader";
import { HeaderSubNav } from "./header-sub-nav";
import { MobileHeaderSubNav } from "./mobile-header-sub-nav";
import { NavItem } from "./nav-item";

const UserProfileButton = () => {
  const { profile } = useAuth();
  if (!profile?.identity.isRegistered) {
    return null;
  }
  return (
    <Button asChild variant="secondary" size="icon" className="rounded-full">
      <Link to="/my-profile">
        <img
          src={profile.identity.avatarUrl}
          alt="User avatar"
          className="size-7 rounded-full"
        />
      </Link>
    </Button>
  );
};

export function Header() {
  return (
    <header className="bg-background/60 sticky top-0 z-10 flex items-center gap-4 border-b py-2 backdrop-blur">
      <HeaderRouteLoader />
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
                    <Link
                      href="/"
                      className="flex items-center gap-2 text-lg font-semibold"
                    >
                      <AssetImage
                        className="h-6"
                        src="/logo/cream.svg"
                        alt="Rivet logo"
                      />
                    </Link>
                    <MobileBreadcrumbs />
                    <MobileHeaderSubNav />
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
            <Link to="/">
              <AssetImage
                className="h-6"
                alt="Rivet Logo"
                src="/logo/cream.svg"
              />
            </Link>
            <div className="hidden md:flex">
              <Breadcrumbs />
            </div>
          </nav>
          <div className="gap-6 font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm">
            <CommandPanel />
            <NavItem asChild className="hidden md:inline-block">
              <a href="https://rivet.gg/docs" target="_blank" rel="noreferrer">
                Docs
              </a>
            </NavItem>
            <NavItem asChild className="hidden md:inline-block">
              <Link search={{ modal: "feedback" }}>Feedback</Link>
            </NavItem>
            <UserProfileButton />
          </div>
        </div>
        <HeaderSubNav />
      </div>
    </header>
  );
}
