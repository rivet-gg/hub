import { gameBackendProjectEnvsQueryOptions } from "@/domains/game/queries";
import { faPuzzle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@rivet-gg/components";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useRouteContext } from "@tanstack/react-router";
import { useContext } from "react";
import { Fragment } from "react/jsx-runtime";
import { NavItem } from "../header/nav-item";
import { GameBreadcrumb } from "./game-breadcrumb";
import { MobileBreadcrumbsContext } from "./mobile-breadcrumbs";
import { Separator } from "./separator";

interface BackendEnvironmentBreadcrumbProps {
  gameId: string;
  environmentId: string;
}

export function BackendEnvironmentBreadcrumb({
  gameId,
  environmentId,
}: BackendEnvironmentBreadcrumbProps) {
  const projectId = useRouteContext({
    from: "/_authenticated/_layout/games/$gameId/backend/$environmentId",
    select: (context) => context.projectId,
  });

  const navigate = useNavigate();
  const { data } = useSuspenseQuery(
    gameBackendProjectEnvsQueryOptions(projectId),
  );

  const handleEnvironmentChange = (environmentId: string) => {
    navigate({
      to: "/games/$gameId/backend/$environmentId",
      params: { gameId, environmentId },
    });
  };

  const isMobile = useContext(MobileBreadcrumbsContext);

  const Element = isMobile ? NavItem : Fragment;

  return (
    <>
      <GameBreadcrumb gameId={gameId} />
      <Separator />
      <Element>
        <FontAwesomeIcon icon={faPuzzle} className="mr-1" /> Backend
      </Element>
      <Separator />
      <div>
        <Select value={environmentId} onValueChange={handleEnvironmentChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select environment" />
          </SelectTrigger>
          <SelectContent>
            {data.map((environment) => (
              <SelectItem
                key={environment.environmentId}
                value={environment.environmentId}
              >
                {environment.displayName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
