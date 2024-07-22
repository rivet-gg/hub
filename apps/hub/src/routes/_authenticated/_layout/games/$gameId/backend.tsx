import { gameBackendProjectQueryOptions } from "@/domains/game/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Outlet, createFileRoute } from "@tanstack/react-router";

function GameBackendRoute() {
  const { gameId } = Route.useParams();
  useSuspenseQuery(gameBackendProjectQueryOptions(gameId));
  return <Outlet />;
}

export const Route = createFileRoute(
  "/_authenticated/_layout/games/$gameId/backend",
)({
  component: GameBackendRoute,
});
