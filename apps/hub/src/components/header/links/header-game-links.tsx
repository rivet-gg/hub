import { useFeatureFlag } from "@/hooks/use-feature-flag";
import {
  faCircleDollar,
  faFolder,
  faGear,
  faHammer,
  faHome,
  faKey,
  faPuzzle,
  faServer,
} from "@fortawesome/pro-solid-svg-icons";
import { Link } from "@tanstack/react-router";
import { HeaderLink } from "../header-link";

interface HeaderGameLinksProps {
  gameId: string;
}

export function HeaderGameLinks({ gameId }: HeaderGameLinksProps) {
  const isBackendEnabled = useFeatureFlag("hub-opengb-backend");

  const isServersFeatureEnabled = useFeatureFlag("hub-dynamic-servers");

  return (
    <>
      <HeaderLink icon={isServersFeatureEnabled ? faFolder : faHome}>
        <Link
          to="/games/$gameId"
          activeOptions={{ exact: true }}
          params={{ gameId }}
        >
          {isServersFeatureEnabled ? "Environments" : "Overview"}
        </Link>
      </HeaderLink>
      {isBackendEnabled && !isServersFeatureEnabled ? (
        <HeaderLink icon={faPuzzle}>
          <Link to="/games/$gameId/backend" params={{ gameId }}>
            Backend
          </Link>
        </HeaderLink>
      ) : null}
      {isServersFeatureEnabled ? (
        <>
          <HeaderLink icon={faServer}>
            <Link to="/games/$gameId/servers" params={{ gameId }}>
              Servers
            </Link>
          </HeaderLink>
          <HeaderLink icon={faHammer}>
            <Link to="/games/$gameId/builds" params={{ gameId }}>
              Builds
            </Link>
          </HeaderLink>
        </>
      ) : null}
      <HeaderLink icon={faKey}>
        <Link to="/games/$gameId/tokens" params={{ gameId }}>
          Tokens
        </Link>
      </HeaderLink>
      <HeaderLink icon={faCircleDollar}>
        <Link to="/games/$gameId/billing" params={{ gameId }}>
          Billing
        </Link>
      </HeaderLink>
      <HeaderLink icon={faGear}>
        <Link to="/games/$gameId/settings" params={{ gameId }}>
          Settings
        </Link>
      </HeaderLink>
    </>
  );
}
