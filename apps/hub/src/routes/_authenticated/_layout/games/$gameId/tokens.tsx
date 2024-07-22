import { Button, DocsCard, Grid, Text } from "@rivet-gg/components";
import { Link, createFileRoute } from "@tanstack/react-router";

function CloudTokenCard() {
  return (
    <>
      <DocsCard
        title="Cloud token"
        href="https://rivet.gg/docs/general/concepts/token-types#cloud"
        footer={
          <Button asChild>
            <Link search={{ modal: "cloud-token" }}>Generate</Link>
          </Button>
        }
      >
        <Text>
          Cloud tokens are used to access Rivet Cloud. They are used by the
          client to access Rivet Cloud.
        </Text>
      </DocsCard>
    </>
  );
}

function ServiceTokenCard() {
  return (
    <>
      <DocsCard
        title="Service token"
        href="https://rivet.gg/docs/general/concepts/handling-game-tokens#public-namespace-tokens"
        footer={
          <Button asChild>
            <Link search={{ modal: "service-token" }}>Generate</Link>
          </Button>
        }
      >
        <Text>
          Service tokens are used from private API servers. These should never
          be shared.
        </Text>
      </DocsCard>
    </>
  );
}

function GameTokensRoute() {
  return (
    <Grid columns={{ initial: "1", md: "2" }} gap="4" items="start">
      <CloudTokenCard />
      <ServiceTokenCard />
    </Grid>
  );
}

export const Route = createFileRoute(
  "/_authenticated/_layout/games/$gameId/tokens",
)({
  component: GameTokensRoute,
});
