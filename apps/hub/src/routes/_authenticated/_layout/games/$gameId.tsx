import { ErrorComponent } from "@/components/error-component";
import { GameBillingProvider } from "@/domains/game/components/game-billing/game-billing-context";
import { GameBillingOverageWarning } from "@/domains/game/components/game-billing/game-billing-overage-warning";
import { getOrCreateBackendProject } from "@/domains/game/helpers/get-or-create-backend-project";
import * as Layout from "@/domains/game/layouts/game-layout";
import { gameQueryOptions } from "@/domains/game/queries";
import { useDialog } from "@/hooks/use-dialog";

import {
  type ErrorComponentProps,
  Outlet,
  createFileRoute,
} from "@tanstack/react-router";
import { z } from "zod";

function GameIdErrorComponent(props: ErrorComponentProps) {
  return (
    <Layout.EmptyRoot>
      <ErrorComponent {...props} />
    </Layout.EmptyRoot>
  );
}

function Modals() {
  const navigate = Route.useNavigate();
  const { gameId } = Route.useParams();
  const { modal } = Route.useSearch();
  const { projectId } = Route.useRouteContext();

  const GenerateGameCloudTokenDialog = useDialog.GenerateGameCloudToken.Dialog;
  const GenerateGameServiceTokenDialog =
    useDialog.GenerateGameServiceToken.Dialog;
  const CreateNewBackendEnvironment = useDialog.CreateBackendEnv.Dialog;

  const handleonOpenChange = (value: boolean) => {
    if (!value) {
      navigate({ search: { modal: undefined } });
    }
  };

  return (
    <>
      <GenerateGameCloudTokenDialog
        gameId={gameId}
        dialogProps={{
          open: modal === "cloud-token",
          onOpenChange: handleonOpenChange,
        }}
      />
      <GenerateGameServiceTokenDialog
        gameId={gameId}
        dialogProps={{
          open: modal === "service-token",
          onOpenChange: handleonOpenChange,
        }}
      />
      <CreateNewBackendEnvironment
        gameId={gameId}
        projectId={projectId}
        dialogProps={{
          open: modal === "create-environment",
          onOpenChange: handleonOpenChange,
        }}
      />
    </>
  );
}

function GameIdRoute() {
  const { gameId, developerGroupId } = Route.useRouteContext();

  return (
    <Layout.Root>
      <GameBillingProvider gameId={gameId} groupId={developerGroupId}>
        <GameBillingOverageWarning />
        <Outlet />
      </GameBillingProvider>
      <Modals />
    </Layout.Root>
  );
}

const searchSchema = z.object({
  modal: z
    .enum(["cloud-token", "service-token", "create-environment"])
    .or(z.string())
    .optional(),
});

export const Route = createFileRoute("/_authenticated/_layout/games/$gameId")({
  validateSearch: (search) => searchSchema.parse(search),
  beforeLoad: async ({ context: { queryClient }, params: { gameId } }) => {
    const backendConfig = await getOrCreateBackendProject(gameId, queryClient);
    const response = await queryClient.ensureQueryData(
      gameQueryOptions(gameId),
    );
    return {
      gameId,
      developerGroupId: response.game.developerGroupId,
      ...backendConfig,
    };
  },
  component: GameIdRoute,
  errorComponent: GameIdErrorComponent,
});
