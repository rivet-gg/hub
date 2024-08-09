import type { Rivet } from "@rivet-gg/api";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Text,
  useBreakpoint,
} from "@rivet-gg/components";
import { Suspense } from "react";
import { GameServersListPanel } from "./game-servers-list-panel";
import { GameServersServerDetailsPanel } from "./game-servers-server-details-panel";

interface GameServersListPreview {
  servers: Rivet.servers.Server[];
  serverId?: string;
}

export function GameServersListPreview({
  servers,
  serverId,
}: GameServersListPreview) {
  if (servers.length === 0) {
    return (
      <Text my="10" textAlign="center">
        No servers found.
      </Text>
    );
  }

  const isMd = useBreakpoint("md");

  return (
    <ResizablePanelGroup
      className="min-w-0 w-full h-full max-h-full"
      autoSaveId="rivet-game-backend-logs"
      direction={isMd ? "horizontal" : "vertical"}
    >
      <ResizablePanel minSize={25} maxSize={75}>
        <div className="h-full max-h-full overflow-hidden w-full truncate min-w-0">
          <GameServersListPanel servers={servers} serverId={serverId} />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel minSize={25} maxSize={75}>
        <div className="h-full max-h-full overflow-hidden w-full">
          <Suspense fallback={<GameServersServerDetailsPanel.Skeleton />}>
            <GameServersServerDetailsPanel serverId={serverId} />
          </Suspense>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
