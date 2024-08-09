import { Flex, Text } from "@rivet-gg/components";
import { GameServersServerDetails } from "./game-servers-server-details";

interface GameServersServerDetailsPanelProps {
  serverId: string | undefined;
}

export function GameServersServerDetailsPanel({
  serverId,
}: GameServersServerDetailsPanelProps) {
  if (!serverId) {
    return (
      <Flex items="center" justify="center" className="h-full">
        <Text textAlign="center">
          Please select a server from the list on the left.
        </Text>
      </Flex>
    );
  }

  return <GameServersServerDetails serverId={serverId} />;
}
GameServersServerDetailsPanel.Skeleton = GameServersServerDetails.Skeleton;
