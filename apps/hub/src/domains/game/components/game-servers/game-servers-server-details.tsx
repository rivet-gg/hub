import {
  Button,
  CopyButton,
  Flex,
  LogsView,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
} from "@rivet-gg/components";
import { ErrorBoundary } from "@sentry/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { serverQueryOptions, useDestroyServerMutation } from "../../queries";
import { LobbyLifecycle } from "../game-matchmaker/lobby-lifecycle";
import { GameServerLogsTab } from "./game-server-logs-tab";
import { GameServerNetworkTab } from "./game-server-network-tab";
import { GameServerRuntimeTab } from "./game-server-runtime-tab";
import { GameServerTags } from "./game-server-tags";

interface GameServersServerDetailsProps {
  serverId: string;
}

export function GameServersServerDetails({
  serverId,
}: GameServersServerDetailsProps) {
  const { data } = useSuspenseQuery(serverQueryOptions(serverId));

  const { mutate } = useDestroyServerMutation();

  if (!data) {
    return (
      <Flex items="center" justify="center" className="h-full">
        <Text my="10" textAlign="center">
          No server found.
        </Text>
      </Flex>
    );
  }

  return (
    <ErrorBoundary
      fallback={
        <Flex items="center" justify="center" className="h-full">
          <Text textAlign="center">
            An error occurred while fetching server data.
          </Text>
        </Flex>
      }
    >
      <Flex direction="col" className="h-full w-full" pt="4">
        <Flex items="start" gap="2" px="4">
          <Flex direction="col" gap="4" className="flex-1">
            <GameServerTags {...data} />
            <Flex gap="2">
              <CopyButton value={data.serverId}>
                <Button variant="outline">Copy ID</Button>
              </CopyButton>
              {!data.destroyTs ? (
                <Button
                  variant="destructive"
                  onClick={() => mutate(data.serverId)}
                >
                  Destroy
                </Button>
              ) : null}
            </Flex>
          </Flex>

          <Flex>
            <LobbyLifecycle
              createTs={data.createTs}
              readyTs={data.startTs}
              stopTs={data.destroyTs}
            />
          </Flex>
        </Flex>
        <Tabs
          defaultValue="output"
          className="flex-1 min-h-0 flex flex-col mt-4"
        >
          <TabsList className="overflow-auto">
            <TabsTrigger value="output">Output</TabsTrigger>
            <TabsTrigger value="errors">Error</TabsTrigger>
            <TabsTrigger value="runtime">Runtime</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
          </TabsList>
          <TabsContent value="output" className="min-h-0 flex-1 mt-0 p-4">
            <Suspense fallback={<GameServerLogsTab.Skeleton />}>
              <GameServerLogsTab serverId={serverId} logType="std_out" />
            </Suspense>
          </TabsContent>
          <TabsContent value="errors" className="min-h-0 flex-1 mt-0 p-4">
            <Suspense fallback={<GameServerLogsTab.Skeleton />}>
              <GameServerLogsTab serverId={serverId} logType="std_err" />
            </Suspense>
          </TabsContent>
          <TabsContent value="runtime" className="min-h-0 flex-1 mt-0">
            <GameServerRuntimeTab {...data} />
          </TabsContent>
          <TabsContent value="network" className="min-h-0 flex-1 mt-0">
            <GameServerNetworkTab {...data} />
          </TabsContent>
        </Tabs>
      </Flex>
    </ErrorBoundary>
  );
}

GameServersServerDetails.Skeleton = () => {
  return (
    <Flex className="h-full flex-col">
      <div className="flex flex-col gap-4 px-4 flex-wrap">
        <Skeleton className="mt-3 mx-auto h-10 w-full" />
        <div className="flex gap-2 items-center">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-6 w-1/5" />
        </div>
        <div className="flex gap-2 flex-col">
          <Skeleton className="h-6 w-1/6" />
          <Skeleton className="h-6 w-1/4" />
        </div>
      </div>
      <div className="mt-4 flex gap-1 px-4">
        <Skeleton className="h-6 w-1/5" />
        <Skeleton className="h-6 w-1/5" />
        <Skeleton className="h-6 w-1/5" />
      </div>
      <div className="px-4 pt-4">
        <LogsView.Skeleton />
      </div>
    </Flex>
  );
};
