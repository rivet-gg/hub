import { GameAvatar } from "@/domains/game/components/game-avatar";
import type { Rivet } from "@rivet-gg/api";
import { CommandItem } from "@rivet-gg/components";
import { useCommandPanelNavigation } from "./command-panel-navigation-provider";

interface GamesCommandPanelItemsProps {
  games: Rivet.game.Summary[];
  groupId: string;
}

export function GamesCommandPanelItems({ games }: GamesCommandPanelItemsProps) {
  const { changePage } = useCommandPanelNavigation();
  return (
    <>
      {games.map((game) => (
        <CommandItem
          key={game.gameId}
          value={game.gameId}
          keywords={[game.displayName]}
          onSelect={() => {
            changePage({
              key: "game",
              params: { gameId: game.gameId },
            });
          }}
        >
          <GameAvatar
            className="mr-2 size-4"
            displayName={game.displayName}
            logoUrl={game.logoUrl}
          />
          {game.displayName}
        </CommandItem>
      ))}
    </>
  );
}
