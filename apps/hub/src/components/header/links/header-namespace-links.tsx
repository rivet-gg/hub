import { gameNamespaceQueryOptions } from "@/domains/game/queries";
import {
  faChessKnight,
  faCodeBranch,
  faGlobe,
  faHome,
  faKey,
} from "@fortawesome/pro-solid-svg-icons";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { HeaderLink } from "../header-link";

interface NamespaceLinksProps {
  namespaceId: string;
  gameId: string;
}

export function HeaderNamespaceLinks({
  gameId,
  namespaceId,
}: NamespaceLinksProps) {
  const { data } = useSuspenseQuery(
    gameNamespaceQueryOptions({ gameId, namespaceId }),
  );

  return (
    <>
      <HeaderLink icon={faHome}>
        <Link
          to="/games/$gameId/namespaces/$namespaceId"
          activeOptions={{ exact: true }}
          params={{ gameId, namespaceId }}
        >
          Overview
        </Link>
      </HeaderLink>
      <HeaderLink icon={faCodeBranch}>
        <Link
          to="/games/$gameId/namespaces/$namespaceId/versions"
          params={{ gameId, namespaceId }}
        >
          Versions
        </Link>
      </HeaderLink>
      {data.namespace.config.matchmaker ? (
        <HeaderLink icon={faChessKnight}>
          <Link
            to="/games/$gameId/namespaces/$namespaceId/lobbies"
            params={{ gameId, namespaceId }}
          >
            Lobbies
          </Link>
        </HeaderLink>
      ) : null}
      {data.namespace.config.cdn ? (
        <HeaderLink icon={faGlobe}>
          <Link
            to="/games/$gameId/namespaces/$namespaceId/cdn"
            params={{ gameId, namespaceId }}
          >
            CDN
          </Link>
        </HeaderLink>
      ) : null}
      <HeaderLink icon={faKey}>
        <Link
          to="/games/$gameId/namespaces/$namespaceId/tokens"
          params={{ gameId, namespaceId }}
        >
          Tokens
        </Link>
      </HeaderLink>
    </>
  );
}
