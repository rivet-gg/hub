import { queryOptions, useMutation } from "@tanstack/react-query";
import { queryClient, rivetClient } from "../../../queries/global";
import { Rivet } from "@rivet-gg/api";
import { getMetaWatchIndex } from "@/queries/utils";
import { version } from "os";

export type GroupGames = Rivet.group.Summary & { games: Rivet.game.Summary[] };

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
    queryFn: ({ queryKey: [_, gameId], meta }) =>
      rivetClient.cloud.games.games.getGameById(gameId, {
        watchIndex: getMetaWatchIndex(meta),
      }),
    meta: { watch: true },
    select: (data) => ({
      ...data,
      game: {
        ...data.game,
        namespaces: data.game.namespaces.map((namespace) => ({
          ...namespace,
          version: data.game.versions.find(
            (version) => version.versionId === namespace.versionId,
          ),
        })),
      },
    }),
  });
};

export const gameNamespacesQueryOptions = (gameId: string) => {
  return queryOptions({
    ...gameQueryOptions(gameId),
    select: (data) => gameQueryOptions(gameId).select!(data).game.namespaces,
  });
};

export const gameVersionsQueryOptions = (gameId: string) => {
  return queryOptions({
    ...gameQueryOptions(gameId),
    select: (data) =>
      gameQueryOptions(gameId).select!(data)
        .game.versions.map((version) => ({
          ...version,
          createTs: new Date(version.createTs),
        }))
        .sort((a, b) => b.createTs.getTime() - a.createTs.getTime()),
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
      gameQueryOptions(gameId).select!(data).game.versions.find(
        (version) => version.versionId === versionId,
      )!,
  });

export const useGameCreateMutation = ({
  onSuccess,
}: {
  onSuccess?: (data: Rivet.cloud.games.CreateGameResponse) => void;
} = {}) => {
  return useMutation({
    mutationFn: (data: Rivet.cloud.games.CreateGameRequest) =>
      rivetClient.cloud.games.games.createGame(data),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries(gamesQueryOptions());
      onSuccess?.(data);
    },
  });
};

export const useNamespaceCreateMutation = ({
  onSuccess,
}: {
  onSuccess?: (
    data: Rivet.cloud.games.namespaces.CreateGameNamespaceResponse,
  ) => void;
} = {}) => {
  return useMutation({
    mutationFn: ({
      gameId,
      ...data
    }: Rivet.cloud.games.namespaces.CreateGameNamespaceRequest & {
      gameId: string;
    }) => rivetClient.cloud.games.namespaces.createGameNamespace(gameId, data),
    onSuccess: async (data, values) => {
      await Promise.all([
        queryClient.invalidateQueries(gameQueryOptions(values.gameId)),
        queryClient.invalidateQueries(gamesQueryOptions()),
      ]);
      onSuccess?.(data);
    },
  });
};

export const gameNamespaceQueryOptions = ({
  gameId,
  namespaceId,
}: {
  gameId: string;
  namespaceId: string;
}) => {
  return queryOptions({
    queryKey: ["gameNamespace", gameId, namespaceId],
    queryFn: ({ queryKey: [_, gameId, namespaceId] }) =>
      rivetClient.cloud.games.namespaces.getGameNamespaceById(
        gameId,
        namespaceId,
      ),
    meta: { watch: true },
  });
};

export const useUpdateGameNamespaceVersionMutation = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  return useMutation({
    mutationFn: ({
      gameId,
      namespaceId,
      versionId,
    }: {
      gameId: string;
      namespaceId: string;
    } & Rivet.cloud.games.namespaces.UpdateGameNamespaceVersionRequest) =>
      rivetClient.cloud.games.namespaces.updateGameNamespaceVersion(
        gameId,
        namespaceId,
        { versionId },
      ),
    onSuccess: async (data, values) => {
      await queryClient.invalidateQueries(gameQueryOptions(values.gameId));
      onSuccess?.();
    },
  });
};
