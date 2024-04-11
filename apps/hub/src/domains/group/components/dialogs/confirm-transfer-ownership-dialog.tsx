import {
  Button,
  Code,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogProps,
  DialogTitle,
  Link,
  Strong,
  Text,
} from "@rivet-gg/components";
import {
  groupMemberQueryOptions,
  useGroupTransferOwnershipMutation,
} from "../../queries";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { groupGamesQueryOptions } from "@/domains/game/queries";
import { Suspense } from "react";
import { DialogActivityIndicator } from "@/components/dialog-activity-indicator";

interface ContentProps {
  groupId: string;
  memberIdentityId: string;
  onSuccess?: () => void;
}

function Content({ groupId, memberIdentityId, onSuccess }: ContentProps) {
  const { data: group } = useSuspenseQuery(groupGamesQueryOptions(groupId));
  const { data: groupMember } = useQuery(
    groupMemberQueryOptions({ memberIdentityId, groupId }),
  );
  const { mutate, isPending } = useGroupTransferOwnershipMutation({
    onSuccess,
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogDescription asChild>
          <div>
            <Text>
              Are you sure you want to transfer ownership of group{" "}
              <Code>{group?.displayName}</Code>? This action{" "}
              <Strong>CANNOT</Strong> be undone.
            </Text>
            <Text>
              <Strong>
                As a developer group, transferring ownership will cause all
                billing related emails to be sent to the new owner. Your bank
                account information will stay attached to the group unless
                removed by a Rivet employee.
              </Strong>
            </Text>
            <Text>
              Contact{" "}
              <Link href="https://rivet.gg/support" target="_blank">
                Support
              </Link>{" "}
              for more info.
            </Text>
            <Text>
              New owner: <Strong>{groupMember?.identity.displayName}</Strong>
            </Text>
          </div>
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button
          type="submit"
          isLoading={isPending}
          onClick={() => {
            mutate({ groupId, newOwnerIdentityId: memberIdentityId });
          }}
        >
          Confirm
        </Button>
      </DialogFooter>
    </>
  );
}

interface ConfirmTransferOwnershipDialogProps
  extends DialogProps,
    Partial<ContentProps> {}

export function ConfirmTransferOwnershipDialog({
  groupId,
  memberIdentityId,
  onSuccess,
  ...dialogProps
}: ConfirmTransferOwnershipDialogProps) {
  return (
    <Dialog {...dialogProps}>
      <DialogContent>
        {groupId && memberIdentityId ? (
          <Suspense fallback={<DialogActivityIndicator />}>
            <Content
              groupId={groupId}
              memberIdentityId={memberIdentityId}
              onSuccess={onSuccess}
            />
          </Suspense>
        ) : (
          <DialogActivityIndicator />
        )}
      </DialogContent>
    </Dialog>
  );
}