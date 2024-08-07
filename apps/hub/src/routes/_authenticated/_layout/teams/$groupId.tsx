import { ErrorComponent } from "@/components/error-component";
import * as Layout from "@/domains/game/layouts/group-layout";
import { groupGamesQueryOptions } from "@/domains/game/queries";
import { useDialog } from "@/hooks/use-dialog";
import {
  type ErrorComponentProps,
  Outlet,
  createFileRoute,
  notFound,
} from "@tanstack/react-router";
import { z } from "zod";

function GroupIdErrorComponent(props: ErrorComponentProps) {
  return (
    <Layout.Root>
      <ErrorComponent {...props} />
    </Layout.Root>
  );
}

function Modals() {
  const navigate = Route.useNavigate();
  const { groupId } = Route.useParams();
  const { modal } = Route.useSearch();

  const CreateGroupInviteDialog = useDialog.CreateGroupInvite.Dialog;
  const CreateGroupGameDialog = useDialog.CreateGroupGame.Dialog;
  const ConfirmLeaveGroupDialog = useDialog.ConfirmLeaveGroup.Dialog;

  const handleonOpenChange = (value: boolean) => {
    if (!value) {
      navigate({ search: { modal: undefined } });
    }
  };

  return (
    <>
      <CreateGroupInviteDialog
        groupId={groupId}
        dialogProps={{
          open: modal === "invite",
          onOpenChange: handleonOpenChange,
        }}
      />
      <CreateGroupGameDialog
        groupId={groupId}
        dialogProps={{
          open: modal === "create-game",
          onOpenChange: handleonOpenChange,
        }}
      />
      <ConfirmLeaveGroupDialog
        groupId={groupId}
        onSuccess={() => navigate({ to: "/" })}
        dialogProps={{
          open: modal === "leave",
          onOpenChange: handleonOpenChange,
        }}
      />
    </>
  );
}

function GroupIdView() {
  return (
    <Layout.Root>
      <Outlet />
      <Modals />
    </Layout.Root>
  );
}

const searchSchema = z.object({
  modal: z.enum(["invite", "create-game", "leave"]).or(z.string()).optional(),
});

export const Route = createFileRoute("/_authenticated/_layout/teams/$groupId")({
  validateSearch: (search) => searchSchema.parse(search),
  beforeLoad: async ({ context: { queryClient }, params: { groupId } }) => {
    const data = await queryClient.ensureQueryData({
      ...groupGamesQueryOptions(groupId),
    });

    const group = data.groups.find((group) => group.groupId === groupId);
    if (!group) {
      throw notFound();
    }
  },
  component: GroupIdView,
  errorComponent: GroupIdErrorComponent,
});
