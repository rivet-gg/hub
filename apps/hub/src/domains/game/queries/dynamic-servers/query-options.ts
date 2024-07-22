import { rivetClient } from "@/queries/global";
import type { Rivet } from "@rivet-gg/api";
import { queryOptions } from "@tanstack/react-query";

export const gameServersQueryOptions = (gameId: string) => {
  return queryOptions({
    queryKey: ["servers"],
    queryFn: () => rivetClient.servers.list(),
    select: (data) => data.servers.filter((server) => server.gameId === gameId),
  });
};

export const serverQueryOptions = (serverId: string) => {
  return queryOptions({
    queryKey: ["server", serverId],
    queryFn: () => rivetClient.servers.get(serverId),
    select: (data) => ({
      ...data.server,
      createTs: data.server.createTs
        ? new Date(data.server.createTs)
        : new Date(),
      startTs: data.server.startTs ? new Date(data.server.startTs) : undefined,
      destroyTs: data.server.destroyTs
        ? new Date(data.server.destroyTs)
        : undefined,
    }),
  });
};

export const serverLogsQueryOptions = (
  {
    serverId,
    stream,
  }: {
    serverId: string;
    stream: Rivet.servers.LogStream;
  },
  opts: { refetchInterval?: number } = {},
) => {
  return queryOptions({
    ...opts,
    queryKey: ["server", serverId, "logs", stream],
    queryFn: () => rivetClient.servers.logs.getServerLogs(serverId, { stream }),
    select: (data) => ({
      ...data,
      lines: data.lines.map((line) => window.atob(line)),
    }),
  });
};

export const gameBuildsQueryOptions = (gameId: string) => {
  return queryOptions({
    queryKey: ["game", gameId, "builds"],
    queryFn: ({
      queryKey: [
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _,
        gameId,
      ],
    }) => rivetClient.cloud.games.builds.listGameBuilds(gameId),
    select: (data) => data.builds,
  });
};

export const buildQueryOptions = (buildId: string) => {
  return queryOptions({
    queryFn: () => rivetClient.servers.builds.listBuilds(),
    queryKey: ["build", buildId],
    select: (data) => data.builds.find((build) => build.buildId === buildId),
  });
};
