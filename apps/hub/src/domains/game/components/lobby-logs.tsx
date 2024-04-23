import { useSuspenseQuery } from "@tanstack/react-query";
import {
  gameNamespaceLogsLobbyLogsQueryOptions,
  useExportLobbyLogsMutation,
} from "../queries";
import { Button, LogsView } from "@rivet-gg/components";
import { useState } from "react";
import { Download } from "lucide-react";
import { Rivet } from "@rivet-gg/api";

interface LobbyLogsProps {
  gameId: string;
  lobbyId: string;
}

export function LobbyLogs({ gameId, lobbyId }: LobbyLogsProps) {
  const [logType, setLogType] =
    useState<Rivet.cloud.games.LogStream>("std_out");

  const {
    data: { timestamps, lines },
  } = useSuspenseQuery(
    gameNamespaceLogsLobbyLogsQueryOptions({
      gameId,
      lobbyId,
      stream: logType,
    }),
  );

  const { mutate: download, isPending } = useExportLobbyLogsMutation();

  return (
    <LogsView
      timestamps={timestamps}
      lines={lines}
      logType={logType}
      onLogTypeChange={setLogType}
      sidebar={
        <Button
          isLoading={isPending}
          disabled={timestamps.length === 0 || lines.length === 0}
          variant="outline"
          aria-label="Download logs"
          size="icon"
          onClick={() => download({ lobbyId, gameId, stream: logType })}
        >
          <Download />
        </Button>
      }
    />
  );
}

LobbyLogs.Skeleton = LogsView.Skeleton;