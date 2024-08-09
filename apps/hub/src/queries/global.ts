import { isRivetError } from "@/lib/utils";
import { type Rivet, RivetClient } from "@rivet-gg/api";
import { RivetClient as RivetEeClient } from "@rivet-gg/api-ee";
import { fetcher } from "@rivet-gg/api/core";
import { getConfig, toast } from "@rivet-gg/components";
import { broadcastQueryClient } from "@tanstack/query-broadcast-client-experimental";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import superjson from "superjson";
import { identityTokenQueryOptions } from "../domains/user/queries";
import { watchBlockingQueries } from "./watch";

declare module "@tanstack/react-query" {
  interface Register {
    queryMeta: {
      /**
       * Injected by the watch function to indicate the index to watch for
       * do not use this directly
       */
      __watcher?: { index: string };
      /**
       * If true, the query will be watched for a response
       */
      watch?: true;
    };
  }
}

export async function getToken() {
  const tokenCache = queryClient
    .getQueryCache()
    .find<Rivet.auth.RefreshIdentityTokenResponse>(identityTokenQueryOptions());

  if (tokenCache?.state.status === "success" && tokenCache.state.data) {
    return tokenCache.state.data.token as string;
  }

  if (tokenCache?.state.status === "pending") {
    const token = (await tokenCache.promise)?.token;

    if (token) {
      return token;
    }
  }

  return (await queryClient.fetchQuery(identityTokenQueryOptions())).token;
}

const clientOptions: RivetClient.Options = {
  environment: getConfig().apiUrl,
  fetcher: (args) => fetcher({ ...args, withCredentials: true }),
  token: getToken,
};

export const rivetClientTokeneless = new RivetClient({
  environment: clientOptions.environment,
  fetcher: clientOptions.fetcher,
});
export const rivetClient = new RivetClient(clientOptions);
export const rivetEeClient = new RivetEeClient(clientOptions);

const queryCache = new QueryCache();

const mutationCache = new MutationCache({
  onError(error, variables, context, mutation) {
    if (mutation.meta?.hideErrorToast) {
      return;
    }
    toast.error("Error occurred while performing the operation.", {
      description: isRivetError(error) ? error.body.message : undefined,
    });
  },
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 1000,
      gcTime: 1000 * 60 * 60 * 24,
      retry: 0,
    },
  },
  queryCache,
  mutationCache,
});

export const queryClientPersister = createSyncStoragePersister({
  storage: window.localStorage,
  serialize: superjson.stringify,
  deserialize: superjson.parse,
});

watchBlockingQueries(queryClient);

broadcastQueryClient({
  queryClient,
  broadcastChannel: "rivet-gg-hub",
});
