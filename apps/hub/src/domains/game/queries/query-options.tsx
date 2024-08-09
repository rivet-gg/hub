import { rivetClient } from "@/queries/global";
import { getMetaWatchIndex } from "@/queries/utils";
import { queryOptions } from "@tanstack/react-query";

export const gamesQueryOptions = () => {
  return queryOptions({
    queryKey: ["games"],
    queryFn: ({ meta, signal }) =>
      rivetClient.cloud.games.getGames(
        {
          watchIndex: getMetaWatchIndex(meta),
        },
        { abortSignal: signal },
      ),
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
      // biome-ignore lint/style/noNonNullAssertion: when we get here, we know the group exists
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
      return groupGamesQueryOptions(groupId).select?.(data).ownerIdentityId;
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
      rivetClient.cloud.games.getGameById(gameId, {
        watchIndex: getMetaWatchIndex(meta),
      }),
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
      gameQueryOptions(gameId)
        .select?.(data)
        .versions.sort((a, b) => b.createTs.getTime() - a.createTs.getTime()),
  });
};

export const gameRegionsQueryOptions = (gameId: string) => {
  return queryOptions({
    ...gameQueryOptions(gameId),
    // biome-ignore lint/style/noNonNullAssertion: when we get here, we know the regions exist
    select: (data) => gameQueryOptions(gameId).select?.(data).availableRegions!,
  });
};

export const gameRegionQueryOptions = ({
  gameId,
  regionId,
}: {
  gameId: string;
  regionId: string;
}) => {
  return queryOptions({
    ...gameRegionsQueryOptions(gameId),
    select: (data) =>
      gameRegionsQueryOptions(gameId)
        .select?.(data)
        .find((region) => region.regionId === regionId),
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
      // biome-ignore lint/style/noNonNullAssertion: when we get here, we know the version exists
      gameQueryOptions(gameId)
        .select?.(data)
        .versions.find((version) => version.versionId === versionId)!,
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

export const gameTokenServiceQueryOptions = ({
  gameId,
}: { gameId: string }) => {
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
    }) => rivetClient.cloud.games.tokens.createServiceToken(gameId),
    select: (data) => data.token,
  });
};
