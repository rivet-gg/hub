import { timing } from "@rivet-gg/components";
import { queryOptions } from "@tanstack/react-query";
import { rivetClient, rivetClientTokeneless } from "../../../queries/global";
import { getMetaWatchIndex } from "../../../queries/utils";

export const identityTokenQueryOptions = () => {
  return queryOptions({
    queryKey: ["identityToken"],
    staleTime: timing.minutes(15),
    gcTime: timing.minutes(15),
    queryFn: () =>
      rivetClientTokeneless.auth.tokens.refreshIdentityToken({ logout: false }),
  });
};

export const selfProfileQueryOptions = (opts: { enabled?: boolean } = {}) => {
  return queryOptions({
    ...opts,
    queryKey: ["selfProfile"],
    queryFn: ({ meta }) => {
      return rivetClient.identity.getSelfProfile({
        watchIndex: getMetaWatchIndex(meta),
      });
    },
    meta: { watch: true },
  });
};

export const selfProfileIdentityIdQueryOptions = () => {
  return queryOptions({
    ...selfProfileQueryOptions(),
    select: (data) => data.identity.identityId,
  });
};
