import { GameBillingPlanBadge } from "@/domains/game/components/game-billing/game-billing-plan-badge";
import { GameTableActions } from "@/domains/game/components/game-table-actions";
import { groupGamesQueryOptions } from "@/domains/game/queries";
import {
  AssetImage,
  Button,
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
import { Icon, faPlus } from "@rivet-gg/icons";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";

interface GroupGamesProps {
  groupId: string;
}

export function GroupGames({ groupId }: GroupGamesProps) {
  const { data } = useSuspenseQuery(groupGamesQueryOptions(groupId));

  const navigate = useNavigate();

  return (
    <>
      <Card w="full">
        <CardHeader>
          <Flex items="center" gap="4" justify="between">
            <CardTitle>Games</CardTitle>
            <Link to="." search={{ modal: "create-group-game" }}>
              <Button variant="secondary" size="sm">
                <Icon icon={faPlus} />
              </Button>
            </Link>
          </Flex>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead w="16" />
                <TableHead>Name</TableHead>
                <TableHead w="16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.games.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Text textAlign="center">There's no games yet.</Text>
                  </TableCell>
                </TableRow>
              ) : null}
              {data.games.map((game) => (
                <TableRow
                  key={game.gameId}
                  isClickable
                  onClick={() => {
                    navigate({
                      to: "/games/$gameId",
                      params: { gameId: game.gameId },
                    });
                  }}
                >
                  <TableCell w="16">
                    <AssetImage
                      src={game.logoUrl || "/games/blank/blankgame.svg"}
                      alt={`${game.displayName} logo`}
                      width={64}
                      height={64}
                    />
                  </TableCell>
                  <TableCell>
                    <Text asChild>
                      <Flex items="center" gap="2">
                        {game.displayName}{" "}
                        <GameBillingPlanBadge gameId={game.gameId} />
                      </Flex>
                    </Text>
                  </TableCell>
                  <TableCell>
                    <GameTableActions />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
