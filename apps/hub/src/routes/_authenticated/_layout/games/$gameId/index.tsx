import { GameBackendView } from "@/domains/game/views/game-backend";
import { GameNamespacesView } from "@/domains/game/views/game-namespaces";
import { useFeatureFlag } from "@/hooks/use-feature-flag";
import { createFileRoute } from "@tanstack/react-router";

function GameIdRoute() {
  const { gameId } = Route.useParams();
  const { projectId } = Route.useRouteContext();
  const isDynamicServersFeatureEnabled = useFeatureFlag("hub-dynamic-servers");
  if (isDynamicServersFeatureEnabled) {
    return <GameBackendView gameId={gameId} projectId={projectId} />;
  }
  return <GameNamespacesView gameId={gameId} />;
}

export const Route = createFileRoute("/_authenticated/_layout/games/$gameId/")({
  component: GameIdRoute,
});
