import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandLoading,
} from "@rivet-gg/components";
import { useMatchRoute } from "@tanstack/react-router";
import {
  type KeyboardEventHandler,
  Suspense,
  startTransition,
  useCallback,
  useEffect,
  useState,
} from "react";
import { CommandPanelNavigationBreadcrumbs } from "./command-panel/command-panel-navigation-breadcrumbs";
import {
  CommandPanelNavigationProvider,
  type CommandPanelPage,
} from "./command-panel/command-panel-navigation-provider";
import { GameCommandPanelPage } from "./command-panel/command-panel-page/game-command-panel-page";
import { GroupCommandPanelPage } from "./command-panel/command-panel-page/group-command-panel-page";
import { IndexCommandPanelPage } from "./command-panel/command-panel-page/index-command-panel-page";
import { NamespaceCommandPanelPage } from "./command-panel/command-panel-page/namespace-command-panel-page";

export function CommandPanel() {
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [pages, setPages] = useState<CommandPanelPage[]>([]);
  const page = pages[pages.length - 1];
  const matchRoute = useMatchRoute();

  // biome-ignore lint/correctness/useExhaustiveDependencies: we do not want to run this effect on every change of match route
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        startTransition(() => {
          const isTeam = matchRoute({
            to: "/teams/$groupId",
            fuzzy: true,
          }) as { groupId: string } | false;

          if (isTeam) {
            setPages([{ key: "group", params: { groupId: isTeam.groupId } }]);
          }

          const isGame = matchRoute({
            to: "/games/$gameId",
            fuzzy: true,
          }) as { gameId: string } | false;
          if (isGame) {
            setPages([{ key: "game", params: { gameId: isGame.gameId } }]);
          }

          const isNamespace = matchRoute({
            to: "/games/$gameId/namespaces/$namespaceId",
            fuzzy: true,
          }) as { gameId: string; namespaceId: string } | false;
          if (isNamespace) {
            setPages([
              { key: "game", params: { gameId: isNamespace.gameId } },
              {
                key: "namespace",
                params: {
                  gameId: isNamespace.gameId,
                  namespaceId: isNamespace.namespaceId,
                },
              },
            ]);
          }
          setOpen((open) => !open);
        });
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handlePageChange = useCallback((page: CommandPanelPage) => {
    startTransition(() => {
      setPages((pages) => [...pages, page]);
      setSearch("");
    });
  }, []);

  const handleClose = useCallback(() => {
    startTransition(() => {
      setOpen(false);
      setSearch("");
      setPages([]);
    });
  }, []);

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      // Escape goes to previous page
      // Backspace goes to previous page when search is empty
      if (
        (e.key === "Escape" || (e.key === "Backspace" && !search)) &&
        pages.length > 0
      ) {
        e.preventDefault();
        setPages((pages) => pages.slice(0, -1));
      }
    },
    [pages.length, search],
  );

  return (
    <CommandDialog
      commandProps={{
        onKeyDown: handleKeyDown,
      }}
      open={open}
      onOpenChange={setOpen}
    >
      <CommandPanelNavigationBreadcrumbs pages={pages} />
      <CommandInput
        value={search}
        onValueChange={setSearch}
        placeholder="Type a command or search..."
      />
      <CommandPanelNavigationProvider
        onClose={handleClose}
        onChangePage={handlePageChange}
      >
        <CommandList>
          <Suspense fallback={<CommandLoading>Hang on…</CommandLoading>}>
            <CommandEmpty>No results found.</CommandEmpty>
            {!page ? <IndexCommandPanelPage /> : null}
            {page?.key === "group" ? (
              <GroupCommandPanelPage groupId={page.params.groupId} />
            ) : null}
            {page?.key === "game" ? (
              <GameCommandPanelPage gameId={page.params.gameId} />
            ) : null}
            {page?.key === "namespace" ? (
              <NamespaceCommandPanelPage
                gameId={page.params.gameId}
                namespaceId={page.params.namespaceId}
              />
            ) : null}
          </Suspense>
        </CommandList>
      </CommandPanelNavigationProvider>
    </CommandDialog>
  );
}
