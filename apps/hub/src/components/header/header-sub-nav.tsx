import { useAuth } from "@/domains/auth/contexts/auth";
import { noop } from "@/lib/utils";
import { Skeleton, cn } from "@rivet-gg/components";
import { CatchBoundary, useMatchRoute } from "@tanstack/react-router";
import { Suspense, useContext } from "react";
import { MobileBreadcrumbsContext } from "../breadcrumbs/mobile-breadcrumbs";
import { BackendEnvironmentLinks } from "./links/header-backend-environment-links";
import { HeaderGameLinks } from "./links/header-game-links";
import { HeaderGroupLinks } from "./links/header-group-links";
import { HeaderNamespaceLinks } from "./links/header-namespace-links";

function Content() {
  const matchRoute = useMatchRoute();

  const { profile } = useAuth();

  if (!profile?.identity.isRegistered) {
    return null;
  }

  const namespaceMatch = matchRoute({
    to: "/games/$gameId/namespaces/$namespaceId",
    fuzzy: true,
  }) as { gameId: string; namespaceId: string } | false;

  if (namespaceMatch) {
    return (
      <HeaderNamespaceLinks
        gameId={namespaceMatch.gameId}
        namespaceId={namespaceMatch.namespaceId}
      />
    );
  }

  const backendMatch = matchRoute({
    to: "/games/$gameId/backend/$environmentId",
    fuzzy: true,
  }) as false | { gameId: string; environmentId: string };

  if (backendMatch) {
    return (
      <BackendEnvironmentLinks
        environmentId={backendMatch.environmentId}
        gameId={backendMatch.gameId}
      />
    );
  }

  const gameMatch = matchRoute({ to: "/games/$gameId", fuzzy: true }) as
    | { gameId: string }
    | false;

  if (gameMatch) {
    return <HeaderGameLinks gameId={gameMatch.gameId} />;
  }

  const groupMatch = matchRoute({ to: "/teams/$groupId", fuzzy: true }) as
    | { groupId: string }
    | false;

  if (groupMatch) {
    return <HeaderGroupLinks groupId={groupMatch.groupId} />;
  }

  return null;
}

export function HeaderSubNav() {
  const isMobile = useContext(MobileBreadcrumbsContext);
  return (
    <CatchBoundary getResetKey={() => "reset"} errorComponent={noop}>
      <Suspense
        fallback={
          <div className="-mb-2 hidden md:flex min-h-10 items-center gap-6">
            <Skeleton className="mb-2 h-5 w-16" />
            <Skeleton className="mb-2 h-5 w-16" />
            <Skeleton className="mb-2 h-5 w-16" />
          </div>
        }
      >
        <div
          className={cn({
            "-mx-8 -mb-[9px] hidden md:flex min-h-10 items-center px-8":
              !isMobile,
            "flex flex-col text-left pl-8 gap-6": isMobile,
          })}
        >
          <Content />
        </div>
      </Suspense>
    </CatchBoundary>
  );
}
