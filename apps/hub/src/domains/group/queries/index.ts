import { queryOptions, useMutation } from "@tanstack/react-query";
import { queryClient, rivetClient } from "../../../queries/global";
import { Rivet } from "@rivet-gg/api";
import { gamesQueryOptions } from "../../game/queries";
import { getMetaWatchIndex } from "@/queries/utils";

export const groupMembersQueryOptions = (groupId: string) => {
  return queryOptions({
    queryKey: ["group", groupId],
    queryFn: ({ meta }) =>
      rivetClient.group.getMembers(groupId, {
        watchIndex: getMetaWatchIndex(meta),
      }),
    meta: {
      watch: true,
    },
  });
};

export const groupMemberQueryOptions = ({
  groupId,
  memberIdentityId,
}: {
  groupId: string;
  memberIdentityId: string;
}) => {
  return queryOptions({
    ...groupMembersQueryOptions(groupId),
    select: (data) =>
      data.members.find((m) => m.identity.identityId === memberIdentityId),
  });
};

export const useGroupUpdateProfileMutation = () => {
  return useMutation({
    mutationFn: ({
      groupId,
      ...data
    }: Rivet.group.UpdateProfileRequest & { groupId: string }) =>
      rivetClient.group.updateProfile(groupId, data),
    onSuccess: async (_, variables) => {
      return Promise.all([
        queryClient.invalidateQueries(
          groupMembersQueryOptions(variables.groupId),
        ),
        queryClient.invalidateQueries(gamesQueryOptions()),
      ]);
    },
  });
};

const useAvatarUploadCompleteMutation = () => {
  return useMutation({
    mutationFn: ({
      groupId,
      uploadId,
    }: {
      groupId: string;
      uploadId: string;
    }) => rivetClient.group.completeAvatarUpload(groupId, uploadId),
    onSuccess(_, variables) {
      return Promise.all([
        queryClient.invalidateQueries(
          groupMembersQueryOptions(variables.groupId),
        ),
        queryClient.invalidateQueries(gamesQueryOptions()),
      ]);
    },
  });
};

export const useAvatarUploadMutation = (groupId: string) => {
  const { mutateAsync } = useAvatarUploadCompleteMutation();
  return useMutation({
    mutationFn: ({ file }: { file: File }) =>
      rivetClient.group.prepareAvatarUpload({
        mime: file.type,
        contentLength: file.size,
        path: file.name,
      }),
    onSuccess: async (response, data) => {
      await fetch(response.presignedRequest.url, {
        method: "PUT",
        body: data.file,
        mode: "cors",
        headers: {
          "Content-Type": data.file.type,
        },
      });
      await mutateAsync({
        groupId: groupId,
        uploadId: response.uploadId,
      });
    },
  });
};

export const useGroupTransferOwnershipMutation = ({
  onSuccess,
}: {
  onSuccess?: () => void;
} = {}) => {
  return useMutation({
    mutationFn: ({
      groupId,
      ...rest
    }: { groupId: string } & Rivet.group.TransferOwnershipRequest) =>
      rivetClient.group.transferOwnership(groupId, rest),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries(gamesQueryOptions()),
        queryClient.invalidateQueries(
          groupMembersQueryOptions(variables.groupId),
        ),
      ]);
      onSuccess?.();
    },
  });
};