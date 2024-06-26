import { gameBackendProjectEnvsQueryOptions } from "@/domains/game/queries";
import { GameBackendView } from "@/domains/game/views/game-backend";
import { createFileRoute } from "@tanstack/react-router";

function GameBackendRoute() {
  const { gameId } = Route.useParams();
  const { projectId } = Route.useRouteContext();
  return <GameBackendView gameId={gameId} projectId={projectId} />;
}

export const Route = createFileRoute(
  "/_authenticated/_layout/games/$gameId/backend/",
)({
  component: GameBackendRoute,
  beforeLoad: async ({ context: { queryClient, projectId } }) => {
    await queryClient.ensureQueryData(
      gameBackendProjectEnvsQueryOptions(projectId),
    );
  },
});
