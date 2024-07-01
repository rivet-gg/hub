import { groupGamesQueryOptions } from "@/domains/game/queries";
import { GroupAvatar } from "@/domains/group/components/group-avatar";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Fragment, useContext } from "react";
import { NavItem } from "../header/nav-item";
import { MobileBreadcrumbsContext } from "./mobile-breadcrumbs";

interface GroupBreadcrumbProps {
  groupId: string;
}

export function GroupBreadcrumb({ groupId }: GroupBreadcrumbProps) {
  const { data } = useSuspenseQuery(groupGamesQueryOptions(groupId));

  const isMobile = useContext(MobileBreadcrumbsContext);

  const Element = isMobile ? NavItem : Fragment;

  return (
    <Element>
      <Link
        to="/teams/$groupId"
        params={{ groupId }}
        className="flex items-center gap-2"
      >
        <GroupAvatar
          avatarUrl={data.avatarUrl}
          displayName={data.displayName}
          className={isMobile ? "size-10" : "size-5"}
        />
        {data.displayName}
      </Link>
    </Element>
  );
}
