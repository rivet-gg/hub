import {
  Flex,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
} from "@rivet-gg/components";
import { ErrorBoundary } from "@sentry/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { gameNamespaceLobbyQueryOptions } from "../../queries";
import { LobbyLifecycle } from "./lobby-lifecycle";
import { LobbyLogs } from "./lobby-logs";
import { LobbySummary } from "./lobby-summary";

interface GameMatchmakerLobbyDetailsPanelProps {
  lobbyId?: string;
  gameId: string;
  namespaceId: string;
  isLive?: boolean;
}

export function GameMatchmakerLobbyDetailsPanel({
  lobbyId,
  gameId,
  namespaceId,
  isLive,
}: GameMatchmakerLobbyDetailsPanelProps) {
  if (!lobbyId) {
    return (
      <Flex items="center" justify="center" className="h-full">
        <Text textAlign="center">
          Please select a lobby from the list on the left.
        </Text>
      </Flex>
    );
  }

  const {
    data: { lobby },
  } = useSuspenseQuery(
    gameNamespaceLobbyQueryOptions(
      { gameId, namespaceId, lobbyId },
      { refetchInterval: isLive ? 1000 : undefined, throwOnError: true },
    ),
  );

  return (
    <ErrorBoundary
      fallback={
        <Flex items="center" justify="center" className="h-full">
          <Text textAlign="center">
            An error occurred while fetching lobby data.
          </Text>
        </Flex>
      }
    >
      <Suspense fallback={<LobbySummary.Skeleton />}>
        <LobbySummary
          {...lobby}
          gameId={gameId}
          isLive={isLive}
          rightSide={
            <>
              <LobbyLifecycle
                createTs={lobby.createTs}
                readyTs={lobby.readyTs || lobby.startTs}
                stopTs={lobby.status.stopped?.stopTs}
              />
            </>
          }
        />
      </Suspense>

      <Tabs defaultValue="logs" className="flex-1 min-h-0 flex flex-col mt-4">
        <TabsList className="overflow-auto">
          <TabsTrigger value="logs">Output</TabsTrigger>
          <TabsTrigger value="errors">Error</TabsTrigger>
        </TabsList>
        <TabsContent value="logs" className="min-h-0 flex-1 mt-0 p-4">
          <Suspense fallback={<LobbyLogs.Skeleton />}>
            <LobbyLogs
              logType="std_out"
              lobbyId={lobbyId}
              gameId={gameId}
              isLive={isLive}
            />
          </Suspense>
        </TabsContent>
        <TabsContent value="errors" className="min-h-0 flex-1 mt-0 p-4">
          <Suspense fallback={<LobbyLogs.Skeleton />}>
            <LobbyLogs
              logType="std_err"
              lobbyId={lobbyId}
              gameId={gameId}
              isLive={isLive}
            />
          </Suspense>
        </TabsContent>
      </Tabs>
    </ErrorBoundary>
  );
}

GameMatchmakerLobbyDetailsPanel.Skeleton = () => {
  return (
    <Flex className="h-full flex-col">
      <LobbySummary.Skeleton />
      <LobbyLogs.Skeleton />
    </Flex>
  );
};
