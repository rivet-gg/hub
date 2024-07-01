import { faGear, faHome, faUsers } from "@fortawesome/pro-solid-svg-icons";
import { Link } from "@tanstack/react-router";
import { HeaderLink } from "../header-link";

interface HeaderLinksLinkProps {
  groupId: string;
}

export function HeaderGroupLinks({ groupId }: HeaderLinksLinkProps) {
  return (
    <>
      <HeaderLink icon={faHome}>
        <Link
          to="/teams/$groupId"
          activeOptions={{ exact: true }}
          params={{ groupId }}
        >
          Overview
        </Link>
      </HeaderLink>
      <HeaderLink icon={faUsers}>
        <Link to="/teams/$groupId/members" params={{ groupId }}>
          Members
        </Link>
      </HeaderLink>
      <HeaderLink icon={faGear}>
        <Link to="/teams/$groupId/settings" params={{ groupId }}>
          Settings
        </Link>
      </HeaderLink>
    </>
  );
}
