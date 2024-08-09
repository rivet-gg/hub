import { GameDynamicServersFeatureCard } from "@/domains/game/components/game-dynamic-servers-feature-card";
import { GameLogoSettingsCard } from "@/domains/game/components/game-logo-settings-card";
import { Flex } from "@rivet-gg/components";
import { createFileRoute } from "@tanstack/react-router";

function GameIdSettingsView() {
  const { gameId } = Route.useParams();
  return (
    <Flex gap="4" direction="col">
      <GameDynamicServersFeatureCard />
      <GameLogoSettingsCard gameId={gameId} />
    </Flex>
  );
}

export const Route = createFileRoute(
  "/_authenticated/_layout/games/$gameId/settings/",
)({
  component: GameIdSettingsView,
});
