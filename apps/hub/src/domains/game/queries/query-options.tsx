import { rivetClient } from "@/queries/global";
import { getMetaWatchIndex } from "@/queries/utils";
import { loadModuleCategories } from "@rivet-gg/components";
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
  });
};

export const groupsCountQueryOptions = () => {
  return queryOptions({
    ...gamesQueryOptions(),
    select: (data) => data.groups.length,
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

export const gamesCountQueryOptions = (groupId: string) => {
  return queryOptions({
    ...groupGamesQueryOptions(groupId),
    select: (data) => data.games.length,
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
      signal,
      meta,
    }) =>
      rivetClient.cloud.games.getGameById(
        gameId,
        {
          watchIndex: getMetaWatchIndex(meta),
        },
        { abortSignal: signal },
      ),
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

export const gameEnvTokenServiceQueryOptions = ({
  gameId,
  environmentId,
}: { gameId: string; environmentId: string }) => {
  return queryOptions({
    staleTime: 0,
    gcTime: 0,
    queryKey: ["game", gameId, "namespace", environmentId, "token", "service"],
    queryFn: ({
      queryKey: [
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _,
        gameId,
        __,
        environmentId,
      ],
    }) =>
      rivetClient.games.environments.tokens.createServiceToken(
        gameId,
        environmentId,
      ),
    select: (data) => data.token,
  });
};

export const gameMetadataQueryOptions = ({ gameId }: { gameId: string }) => {
  return queryOptions({
    queryKey: ["game", gameId, "metadata"],
    queryFn: async ({ queryKey: [_, gameId] }) => {
      const data = await rivetClient.cloud.games.getGameById(gameId);

      return {
        legacyLobbiesEnabled: data.game.versions.length > 1,
      };
    },
  });
};

export const modulesCategoriesQueryOptions = () => {
  return queryOptions({
    queryKey: ["modules", "categories"],
    queryFn: () => loadModuleCategories(),
  });
};

const FEATURED_MODULES = ["lobbies", "friends", "analytics"];

export const featuredModulesQueryOptions = () => {
  return queryOptions({
    ...modulesCategoriesQueryOptions(),
    queryKey: ["modules", "featured"],
    select: (data) => {
      return data
        .flatMap((category) => category.modules)
        .filter((module) => FEATURED_MODULES.includes(module.id));
    },
  });
};
