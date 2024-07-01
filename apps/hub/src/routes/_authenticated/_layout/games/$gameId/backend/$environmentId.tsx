import { Outlet, createFileRoute } from "@tanstack/react-router";

function GameBackendEnvIdView() {
  return <Outlet />;
}

export const Route = createFileRoute(
  "/_authenticated/_layout/games/$gameId/backend/$environmentId",
)({
  component: GameBackendEnvIdView,
});
