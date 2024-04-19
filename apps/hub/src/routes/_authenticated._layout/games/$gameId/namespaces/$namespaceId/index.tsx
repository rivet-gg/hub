import { NamespaceVersionTitle } from "@/domains/game/components/namespace-version-title";
import {
  gameNamespaceQueryOptions,
  gameQueryOptions,
} from "@/domains/game/queries";
import { queryClient } from "@/queries/global";
import { Button, Grid, Page, ValueCard } from "@rivet-gg/components";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";

function NamespaceIdRoute() {
  const { namespace, game, version } = Route.useLoaderData();
  return (
    <Page
      title={
        <NamespaceVersionTitle
          namespace={namespace.displayName}
          version={version.displayName}
        />
      }
    >
      <Grid columns="3" gap="4">
        <ValueCard
          title="Current version"
          description={version.displayName}
          footer={
            <Button asChild variant="outline">
              <Link
                to="/games/$gameId/namespaces/$namespaceId/versions"
                params={{
                  gameId: game.gameId,
                  namespaceId: namespace.namespaceId,
                }}
              >
                Manage version
              </Link>
            </Button>
          }
        />
      </Grid>
    </Page>
  );
}

export const Route = createFileRoute(
  "/_authenticated/_layout/games/$gameId/namespaces/$namespaceId/",
)({
  loader: async ({ params: { gameId, namespaceId } }) => {
    const { game } = await queryClient.ensureQueryData(
      gameQueryOptions(gameId),
    );
    const { namespace } = await queryClient.ensureQueryData(
      gameNamespaceQueryOptions({ gameId, namespaceId }),
    );

    const version = game.versions.find(
      (version) => version.versionId === namespace.versionId,
    );

    if (!namespace || !game || !version) {
      throw notFound();
    }

    return { namespace, version, game };
  },
  component: NamespaceIdRoute,
});
