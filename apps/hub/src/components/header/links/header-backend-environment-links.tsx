import { faHome, faKey, faScroll } from "@fortawesome/pro-solid-svg-icons";
import { Link, useRouteContext } from "@tanstack/react-router";
import { HeaderLink } from "../header-link";
import { HedaerBackendEnvironmentDatabaseLink } from "./header-backend-environment-database-link";

interface BackendEnvironmentLinksProps {
  gameId: string;
  environmentId: string;
}

export function BackendEnvironmentLinks({
  gameId,
  environmentId,
}: BackendEnvironmentLinksProps) {
  const projectId = useRouteContext({
    from: "/_authenticated/_layout/games/$gameId/backend/$environmentId",
    select: (context) => context.projectId,
  });

  return (
    <>
      <HeaderLink icon={faHome}>
        <Link
          to="/games/$gameId/backend/$environmentId"
          activeOptions={{ exact: true }}
          params={{ gameId, environmentId }}
        >
          Overview
        </Link>
      </HeaderLink>
      <HeaderLink icon={faScroll}>
        <Link
          to="/games/$gameId/backend/$environmentId/logs"
          params={{ gameId, environmentId }}
        >
          Logs
        </Link>
      </HeaderLink>
      <HedaerBackendEnvironmentDatabaseLink
        projectId={projectId}
        environmentId={environmentId}
      />
      <HeaderLink icon={faKey}>
        <Link
          to="/games/$gameId/backend/$environmentId/variables"
          params={{ gameId, environmentId }}
        >
          Variables
        </Link>
      </HeaderLink>
    </>
  );
}
