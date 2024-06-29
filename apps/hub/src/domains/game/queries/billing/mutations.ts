import { queryClient, rivetEeClient } from "@/queries/global";
import type { Rivet as RivetEe } from "@rivet-gg/api-ee";
import { useMutation } from "@tanstack/react-query";
import { gameBillingQueryOptions } from "../billing/query-options";

export const useUpdateGameBillingMutation = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  return useMutation({
    mutationFn: ({
      gameId,
      plan,
    }: {
      gameId: string;
    } & RivetEe.ee.cloud.games.billing.UpdatePlanRequest) =>
      rivetEeClient.ee.cloud.games.billing.updatePlan(gameId, { plan }),
    onSuccess: async (data, values) => {
      await queryClient.invalidateQueries(
        gameBillingQueryOptions(values.gameId),
      );
      onSuccess?.();
    },
  });
};

export const useCreateBillingPortalSessionMutation = () => {
  return useMutation({
    mutationFn: ({
      groupId,
      intent,
    }: {
      groupId: string;
    } & RivetEe.ee.cloud.groups.billing.CreateStripePortalSessionRequest) =>
      rivetEeClient.ee.cloud.groups.billing.createStripePortalSession(groupId, {
        intent,
      }),
    onSuccess: async (data) => {
      const win = window.open();
      win?.location.assign(data.stripeSessionUrl);
    },
  });
};
