import { GameServerTags } from "@/domains/game/components/game-servers/game-server-tags";
import { gameBuildsQueryOptions } from "@/domains/game/queries";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Flex,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from "@rivet-gg/components";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

function GameBuildsRoute() {
  const { gameId } = Route.useParams();
  const { data: builds } = useSuspenseQuery(gameBuildsQueryOptions(gameId));

  return (
    <Card w="full">
      <CardHeader>
        <Flex items="center" gap="4" justify="between">
          <CardTitle>Builds</CardTitle>
        </Flex>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead>Tags</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {builds.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <Text>There's no builds yet.</Text>
                </TableCell>
              </TableRow>
            ) : null}
            {builds.map((build) => (
              <TableRow key={build.buildId}>
                <TableCell>{build.displayName}</TableCell>
                <TableCell>{build.createTs.toLocaleString()}</TableCell>
                <TableCell>
                  <GameServerTags {...build} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export const Route = createFileRoute(
  "/_authenticated/_layout/games/$gameId/builds",
)({
  component: GameBuildsRoute,
});
