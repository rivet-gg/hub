import {
  gameBackendProjectEnvsQueryOptions,
  gameBackendProjectQueryOptions,
  gameQueryOptions,
} from "@/domains/game/queries";
import { useFeatureFlag } from "@/hooks/use-feature-flag";
import {
  faCircleDollar,
  faCog,
  faHammer,
  faHome,
  faKey,
  faPlus,
  faPuzzle,
  faServer,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CommandGroup, CommandItem } from "@rivet-gg/components";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useCommandPanelNavigation } from "../command-panel-navigation-provider";
import { EnvironmentsCommandPanelItems } from "../environments-command-panel-items";
import { NamespacesCommandPanelItems } from "../namespaces-command-panel-items";

interface GameCommandPanelPage {
  gameId: string;
}

export function GameCommandPanelPage({ gameId }: GameCommandPanelPage) {
  const { data } = useSuspenseQuery(gameQueryOptions(gameId));

  const { navigate, changePage } = useCommandPanelNavigation();

  const isDynamicServersFeatureEnabled = useFeatureFlag("hub-dynamic-servers");

  return (
    <>
      <CommandGroup heading={data.displayName}>
        <CommandItem
          onSelect={() => {
            navigate({ to: "/games/$gameId", params: { gameId } });
          }}
        >
          <FontAwesomeIcon icon={faHome} />
          Overview
        </CommandItem>
        <CommandItem
          onSelect={() => {
            navigate({ to: "/games/$gameId/billing", params: { gameId } });
          }}
        >
          <FontAwesomeIcon icon={faCircleDollar} />
          Billing
        </CommandItem>
        {isDynamicServersFeatureEnabled ? (
          <>
            <CommandItem
              onSelect={() => {
                navigate({ to: "/games/$gameId/servers", params: { gameId } });
              }}
            >
              <FontAwesomeIcon icon={faServer} />
              Servers
            </CommandItem>
            <CommandItem
              onSelect={() => {
                navigate({ to: "/games/$gameId/builds", params: { gameId } });
              }}
            >
              <FontAwesomeIcon icon={faHammer} />
              Builds
            </CommandItem>
          </>
        ) : (
          <CommandItem
            onSelect={() => {
              changePage({ key: "backend", params: { gameId } });
            }}
          >
            <FontAwesomeIcon icon={faPuzzle} />
            Backend
          </CommandItem>
        )}
        <CommandItem
          onSelect={() => {
            navigate({ to: "/games/$gameId/settings", params: { gameId } });
          }}
        >
          <FontAwesomeIcon icon={faCog} />
          Settings
        </CommandItem>
      </CommandGroup>
      {isDynamicServersFeatureEnabled ? (
        <EnvironmentCommandPanelItemsGroup gameId={gameId} />
      ) : (
        <CommandGroup heading="Namespaces">
          <NamespacesCommandPanelItems
            gameId={gameId}
            namespaces={data.namespaces}
          />
        </CommandGroup>
      )}
      <CommandGroup heading="Tokens">
        <CommandItem
          onSelect={() => {
            navigate({
              to: "/games/$gameId",
              params: { gameId },
              search: { modal: "cloud-token" },
            });
          }}
        >
          <FontAwesomeIcon icon={faKey} />
          Generate a cloud token
        </CommandItem>
      </CommandGroup>
    </>
  );
}

function EnvironmentCommandPanelItemsGroup({ gameId }: { gameId: string }) {
  const {
    data: { project },
  } = useSuspenseQuery(gameBackendProjectQueryOptions(gameId));

  if (!project) throw new Error("Project not found");

  const { data } = useSuspenseQuery(
    gameBackendProjectEnvsQueryOptions(project.projectId),
  );

  const { navigate } = useCommandPanelNavigation();

  return (
    <CommandGroup heading="Environments">
      <CommandItem
        onSelect={() => {
          navigate({
            to: "/games/$gameId",
            search: { modal: "create-environment" },
            params: { gameId },
          });
        }}
      >
        <FontAwesomeIcon icon={faPlus} />
        Create a new environment
      </CommandItem>
      <EnvironmentsCommandPanelItems gameId={gameId} environments={data} />
    </CommandGroup>
  );
}
