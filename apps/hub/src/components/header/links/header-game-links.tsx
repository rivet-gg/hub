import { useFeatureFlag } from "@/hooks/use-feature-flag";
import {
  faCircleDollar,
  faGear,
  faHome,
  faKey,
  faPuzzle,
} from "@fortawesome/pro-solid-svg-icons";
import { Link } from "@tanstack/react-router";
import { HeaderLink } from "../header-link";

interface HeaderGameLinksProps {
  gameId: string;
}

export function HeaderGameLinks({ gameId }: HeaderGameLinksProps) {
  const isEnabled = useFeatureFlag("hub-opengb-backend");

  return (
    <>
      <HeaderLink icon={faHome}>
        <Link
          to="/games/$gameId"
          activeOptions={{ exact: true }}
          params={{ gameId }}
        >
          Overview
        </Link>
      </HeaderLink>
      {isEnabled ? (
        <HeaderLink icon={faPuzzle}>
          <Link to="/games/$gameId/backend" params={{ gameId }}>
            Backend
          </Link>
        </HeaderLink>
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
