import { ErrorComponent } from "@/components/error-component";
import { tryCreateBackend } from "@/domains/game/helpers/try-create-backend";
import {
  gameNamespaceQueryOptions,
  gameQueryOptions,
} from "@/domains/game/queries";
import { useDialog } from "@/hooks/use-dialog";
import { queryClient } from "@/queries/global";
import {
  type ErrorComponentProps,
  Outlet,
  createFileRoute,
  notFound,
} from "@tanstack/react-router";
import { z } from "zod";

function Modals() {
  const navigate = Route.useNavigate();
  const { gameId, namespaceId } = Route.useParams();
  const { modal } = Route.useSearch();

  const ConfirmOuterbaseConnectionDialog =
    useDialog.ConfirmOuterbaseConnection.Dialog;

  const CreateDynamicServerDialog = useDialog.CreateDynamicServer.Dialog;

  const handleonOpenChange = (value: boolean) => {
    if (!value) {
      navigate({ search: { modal: undefined } });
    }
  };

  return (
    <>
      <ConfirmOuterbaseConnectionDialog
        environmentId={namespaceId}
        gameId={gameId}
        dialogProps={{
          open: modal === "database",
          onOpenChange: handleonOpenChange,
        }}
      />
      <CreateDynamicServerDialog
        environmentId={namespaceId}
        gameId={gameId}
        dialogProps={{
          open: modal === "create-server",
          onOpenChange: handleonOpenChange,
        }}
      />
    </>
  );
}

function NamespaceErrorComponent(props: ErrorComponentProps) {
  return <ErrorComponent {...props} />;
}

function NamespaceIdRoute() {
  return (
    <>
      <Outlet />
      <Modals />
    </>
  );
}
const searchSchema = z.object({
  modal: z.enum(["database", "create-server"]).or(z.string()).optional(),
});
export const Route = createFileRoute(
  "/_authenticated/_layout/games/$gameId/environments/$namespaceId",
)({
  validateSearch: (search) => searchSchema.parse(search),
  beforeLoad: async ({ params: { gameId, namespaceId } }) => {
    const { game } = await queryClient.fetchQuery(gameQueryOptions(gameId));
    const { namespace } = await queryClient.fetchQuery(
      gameNamespaceQueryOptions({ gameId, namespaceId }),
    );

    const version = game.versions.find(
      (version) => version.versionId === namespace.versionId,
    );

    if (!namespace || !game || !version) {
      throw notFound();
    }

    await tryCreateBackend({ gameId, environmentId: namespaceId, queryClient });

    return { namespace, version };
  },
  component: NamespaceIdRoute,
  errorComponent: NamespaceErrorComponent,
});