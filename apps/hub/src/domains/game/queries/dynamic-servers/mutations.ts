import { rivetClient } from "@/queries/global";
import { useMutation } from "@tanstack/react-query";

export function useDestroyServerMutation() {
  return useMutation({
    mutationFn: (serverId: string) => rivetClient.servers.destroy(serverId),
  });
}
