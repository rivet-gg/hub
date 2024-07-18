import { rivetEeClient } from "@/queries/global";
import { getMetaWatchIndex } from "@/queries/utils";
import { queryOptions } from "@tanstack/react-query";
import _ from "lodash";
import { z } from "zod";
import { BackendEvent } from "./types";

const partialEnvLogsResponse = z
  .object({
    events: z.array(z.object({}).passthrough()),
  })
  .passthrough();

export const gameBackendProjectQueryOptions = (gameId: string) =>
  queryOptions({
    retry: false,
    queryKey: ["game", gameId, "backend-project"],
    // retry only when service is unavailable
    // retry: (count) => {}
    queryFn: ({ queryKey: [_, gameId], signal }) =>
      rivetEeClient.ee.cloud.games.projects.get(gameId, {
        abortSignal: signal,
      }),
  });

export const gameBackendProjectEnvsQueryOptions = (projectId: string) =>
  queryOptions({
    queryKey: ["backend-project", projectId, "envs"],
    queryFn: ({ queryKey: [_, projectId], signal, meta }) =>
      rivetEeClient.ee.cloud.backend.projects.envs.list(
        projectId,
        {
          watchIndex: getMetaWatchIndex(meta),
        },
        {
          abortSignal: signal,
        },
      ),
    select: (data) => data.environments,
    meta: { watch: true },
  });

export const gameBackendProjectEnvQueryOptions = ({
  projectId,
  environmentId,
}: {
  projectId: string;
  environmentId: string;
}) =>
  queryOptions({
    queryKey: ["backend-project", projectId, "env", environmentId],
    queryFn: ({ queryKey: [_, projectId, __, environmentId], signal }) =>
      rivetEeClient.ee.cloud.backend.projects.envs.get(
        projectId,
        environmentId,
        {},
        { abortSignal: signal },
      ),
    select: (data) => data.environment,
  });

export const gameBackendProjectEnvVariablesQueryOptions = ({
  projectId,
  environmentId,
}: {
  projectId: string;
  environmentId: string;
}) =>
  queryOptions({
    queryKey: ["backend-project", projectId, "env", environmentId, "variables"],
    queryFn: ({ queryKey: [_, projectId, __, environmentId], signal }) =>
      rivetEeClient.ee.cloud.backend.projects.envs.getVariables(
        projectId,
        environmentId,
        { abortSignal: signal },
      ),
    select: (data) => data.variables,
  });

export const gameBackendProjectEnvConfigQueryOptions = ({
  projectId,
  environmentId,
}: {
  projectId: string;
  environmentId: string;
}) =>
  queryOptions({
    queryKey: ["backend-project", projectId, "env", environmentId, "config"],
    queryFn: ({ queryKey: [_, projectId, __, environmentId], signal }) =>
      rivetEeClient.ee.cloud.backend.projects.envs.getConfig(
        projectId,
        environmentId,
        { abortSignal: signal },
      ),
    select: (data) => data.config,
  });

export const gameBackendProjectEnvEventsQueryOptions = ({
  projectId,
  environmentId,
}: {
  projectId: string;
  environmentId: string;
}) =>
  queryOptions({
    queryKey: ["backend-project", projectId, "env", environmentId, "events"],
    queryFn: async ({
      queryKey: [_, projectId, __, environmentId],
      meta,
      signal,
    }) => {
      const response =
        await rivetEeClient.ee.cloud.backend.projects.envs.getEvents(
          projectId,
          environmentId,
          { watchIndex: getMetaWatchIndex(meta) },
          { abortSignal: signal },
        );
      return {
        ...response,
        events: z.array(BackendEvent).parse(response.events),
      };
    },
    select: (data) => data.events,
    structuralSharing: (oldData, newData) => {
      const newParseResult = partialEnvLogsResponse.safeParse(newData);
      const oldParseResult = partialEnvLogsResponse.safeParse(oldData);

      if (newParseResult.success && oldParseResult.success) {
        return {
          ...newParseResult.data,
          events: _.uniqBy(
            [...newParseResult.data.events, ...oldParseResult.data.events],
            "eventTimestamp",
          ),
        };
      }

      return newData;
    },
    meta: {
      watch: true,
    },
  });

export const gameBackendProjectEnvEventQueryOptions = ({
  projectId,
  environmentId,
  eventId,
}: {
  projectId: string;
  environmentId: string;
  eventId: string;
}) =>
  queryOptions({
    ...gameBackendProjectEnvEventsQueryOptions({ projectId, environmentId }),
    select: (data) =>
      data.events.find((event) => event.eventTimestamp === eventId),
  });

export const gameBackendProjectEnvDatabaseQueryOptions = ({
  projectId,
  environmentId,
}: {
  projectId: string;
  environmentId: string;
}) =>
  queryOptions({
    queryKey: ["backend-project", projectId, "env", environmentId, "database"],
    queryFn: ({ queryKey: [_, projectId, __, environmentId] }) =>
      rivetEeClient.ee.cloud.backend.projects.envs.getDbUrl(
        projectId,
        environmentId,
      ),
  });

/**
 * Used only for storing query key
 */
export const gameBackendProjectEnvDatabasePreviewQueryOptions = ({
  projectId,
  environmentId,
}: {
  projectId: string;
  environmentId: string;
}) =>
  queryOptions({
    gcTime: Number.POSITIVE_INFINITY,
    staleTime: Number.POSITIVE_INFINITY,
    enabled: false,
    queryKey: [
      "backend-project",
      projectId,
      "env",
      environmentId,
      "database",
      "preview",
    ],
  });
