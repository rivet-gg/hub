import { rivetClient } from "@/queries/global";
import { getMetaWatchIndex } from "@/queries/utils";
import { queryOptions } from "@tanstack/react-query";

export const gamesQueryOptions = () => {
  return queryOptions({
    queryKey: ["games"],
    queryFn: ({ meta }) =>
      rivetClient.cloud.games.games.getGames({
        watchIndex: getMetaWatchIndex(meta),
      }),
    select: (data) => {
      return data.groups.map((group) => {
        return {
          ...group,
          games: data.games.filter(
            (game) => game.developer.groupId === group.groupId,
          ),
        };
      });
    },
    meta: { watch: true },
  });
};

export const groupGamesQueryOptions = (groupId: string) => {
  return queryOptions({
    ...gamesQueryOptions(),
    select: (data) => {
      const group = data.groups.find((group) => group.groupId === groupId)!;
      const games = data.games.filter(
        (game) => game.developer.groupId === group.groupId,
      );
      return {
        ...group,
        games,
      };
    },
  });
};

export const groupOnwerQueryOptions = (groupId: string) => {
  return queryOptions({
    ...groupGamesQueryOptions(groupId),
    select: (data) => {
      return groupGamesQueryOptions(groupId).select!(data).ownerIdentityId;
    },
  });
};

export const gameQueryOptions = (gameId: string) => {
  return queryOptions({
    queryKey: ["game", gameId],
    queryFn: ({
      queryKey: [
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _,
        gameId,
      ],
      meta,
    }) =>
      rivetClient.cloud.games.games.getGameById(gameId, {
        watchIndex: getMetaWatchIndex(meta),
      }),
    meta: { watch: true },
    select: (data) => ({
      ...data.game,
      namespaces: data.game.namespaces.map((namespace) => ({
        ...namespace,
        version: data.game.versions.find(
          (version) => version.versionId === namespace.versionId,
        ),
      })),
    }),
  });
};

export const gameVersionsQueryOptions = (gameId: string) => {
  return queryOptions({
    ...gameQueryOptions(gameId),
    select: (data) =>
      gameQueryOptions(gameId).select!(data).versions.sort(
        (a, b) => b.createTs.getTime() - a.createTs.getTime(),
      ),
  });
};

export const gameRegionsQueryOptions = (gameId: string) => {
  return queryOptions({
    ...gameQueryOptions(gameId),
    select: (data) => gameQueryOptions(gameId).select!(data).availableRegions,
  });
};

export const gameVersionQueryOptions = ({
  gameId,
  versionId,
}: {
  gameId: string;
  versionId: string;
}) =>
  queryOptions({
    ...gameQueryOptions(gameId),
    select: (data) =>
      gameQueryOptions(gameId).select!(data).versions.find(
        (version) => version.versionId === versionId,
      )!,
  });

export const gameTokenCloudQueryOptions = ({ gameId }: { gameId: string }) => {
  return queryOptions({
    staleTime: 0,
    gcTime: 0,
    queryKey: ["game", gameId, "token", "cloud"],
    queryFn: ({
      queryKey: [
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _,
        gameId,
      ],
    }) => rivetClient.cloud.games.tokens.createCloudToken(gameId),
    select: (data) => data.token,
  });
};
