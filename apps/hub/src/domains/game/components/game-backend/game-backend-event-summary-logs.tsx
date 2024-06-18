import { LogsView, Tabs, TabsList, TabsTrigger } from "@rivet-gg/components";
import { useState } from "react";
import type { BackendEvent } from "../../queries";

type LogType = "std_out" | "std_err";

interface GameBackendEventSummaryLogsProps
  extends Pick<BackendEvent, "logs" | "logTimestamps"> {}

export function GameBackendEventSummaryLogs({
  logs,
  logTimestamps,
}: GameBackendEventSummaryLogsProps) {
  return (
    <>
      <LogsView
        timestamps={logTimestamps}
        lines={logs}
        showFollowToggle={false}
        empty={<p>No logs available.</p>}
      />
    </>
  );
}
