import { isRivetError } from "@/lib/utils";
import { toast } from "@rivet-gg/components";
import * as Sentry from "@sentry/react";
import {
  type Query,
  type QueryClient,
  isCancelledError,
} from "@tanstack/react-query";
import { z } from "zod";

const watchedQueries = new Set<string>();

const watchResponseFragment = z.object({
  watch: z.object({ index: z.string() }),
});

async function watch(query: Query) {
  watchedQueries.add(query.queryHash);
  while (true) {
    try {
      const { watch } = watchResponseFragment.parse(query.state.data);
      await query.fetch(
        {
          ...query.options,
          meta: { __watcher: { index: watch.index } },
        },
        { cancelRefetch: false },
      );
    } catch (error) {
      if (
        (error instanceof Error && error.name === "AbortError") ||
        isCancelledError(error)
      ) {
        return;
      }
      query.cancel({ silent: false, revert: true });
      watchedQueries.delete(query.queryHash);
      toast.error("Error occurred while watching a realtime resource.", {
        description: isRivetError(error) ? error.body.message : undefined,
      });
      Sentry.captureException(error);
      break;
    }
  }
}

export function watchBlockingQueries(queryClient: QueryClient) {
  queryClient.getQueryCache().subscribe((event) => {
    if (event.type === "observerAdded") {
      if (event.query.meta?.watch) {
        if (!event.query.state.data.watch.index) {
          return;
        }
        if (event.query.state.fetchStatus === "fetching") {
          return;
        }

        if (watchedQueries.has(event.query.queryHash)) {
          return;
        }
        watch(event.query);
      }
    }
    if (event.type === "observerRemoved") {
      if (event.query.meta?.watch) {
        if (event.query.getObserversCount() > 0) {
          return;
        }
        event.query.cancel();
        watchedQueries.delete(event.query.queryHash);
      }
    }
  });
}
