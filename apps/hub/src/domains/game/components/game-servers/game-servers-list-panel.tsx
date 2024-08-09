import type { Rivet } from "@rivet-gg/api";
import {
  Badge,
  Button,
  Flex,
  ScrollArea,
  SmallText,
  Uptime,
  WithTooltip,
} from "@rivet-gg/components";
import { Link } from "@tanstack/react-router";
import { GameServerTags } from "./game-server-tags";

interface GameServersListPanelProps {
  servers: Rivet.servers.Server[];
  serverId: string | undefined;
}

export function GameServersListPanel({
  serverId,
  servers,
}: GameServersListPanelProps) {
  return (
    <ScrollArea className="overflow-auto h-full truncate min-w-0">
      <Flex direction="col" gap="2" my="4" mx="4" className="truncate min-w-0">
        <>
          {servers.map((server) => (
            <Button
              key={server.serverId}
              className="h-auto justify-between"
              variant={serverId === server.serverId ? "secondary" : "outline"}
              asChild
            >
              <Link
                search={{ serverId: server.serverId }}
                className="min-w-0 flex flex-wrap gap-2"
              >
                <span className="flex gap-2 items-start">
                  <Badge className="truncate inline-block">
                    {server.serverId.split("-")[0]}
                  </Badge>
                  <GameServerTags {...server} />
                </span>
                <WithTooltip
                  trigger={
                    <SmallText>
                      <Uptime createTs={new Date(server.createTs)} />
                    </SmallText>
                  }
                  content={new Date(server.createTs).toLocaleString()}
                />
              </Link>
            </Button>
          ))}
        </>
      </Flex>
    </ScrollArea>
  );
}
