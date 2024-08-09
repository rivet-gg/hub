import { GameServersListPreview } from "@/domains/game/components/game-servers/game-servers-list-preview";
import { gameServersQueryOptions } from "@/domains/game/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@rivet-gg/components";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

function GameServersRoute() {
  const { gameId } = Route.useParams();
  const { data: servers } = useSuspenseQuery(gameServersQueryOptions(gameId));
  const { serverId } = Route.useSearch();

  return (
    <Card w="full" h="full" className="flex flex-col">
      <CardHeader className="border-b flex flex-row justify-between items-center">
        <CardTitle>Servers</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 w-full p-0">
        <GameServersListPreview serverId={serverId} servers={servers} />
      </CardContent>
    </Card>
  );
}

const searchSchema = z.object({
  serverId: z.string().optional(),
});

export const Route = createFileRoute(
  "/_authenticated/_layout/games/$gameId/servers",
)({
  validateSearch: (search) => searchSchema.parse(search),
  staticData: {
    layout: "full",
  },
  component: GameServersRoute,
});
