import { faSkullCrossbones } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Badge,
  Button,
  CopyArea,
  Flex,
  Skeleton,
  WithTooltip,
} from "@rivet-gg/components";
import type { PropsWithChildren, ReactNode } from "react";
import {
  type LobbySummary as LobbySummaryType,
  useNamespaceMatchmakeDeleteLobbyMutation,
} from "../../queries";
import { LobbyRegion } from "./lobby-region";

function Container({ children }: PropsWithChildren) {
  return (
    <Flex gap="4" direction="col" pt="4" px="4">
      {children}
    </Flex>
  );
}

interface LobbySummaryProps extends LobbySummaryType {
  isLive?: boolean;
  gameId: string;
  rightSide?: ReactNode;
}

export function LobbySummary({
  lobbyGroupNameId,
  lobbyId,
  gameId,
  regionId,
  rightSide,
  namespaceId,
  isLive,
}: LobbySummaryProps) {
  const { mutate: deleteLobby } = useNamespaceMatchmakeDeleteLobbyMutation();

  return (
    <Container>
      <Flex
        gap="2"
        direction={{ initial: "col", md: "row" }}
        className="flex-wrap"
      >
        <Flex direction="col" gap="4" className="min-w-0" items="start">
          <Flex gap="2">
            {isLive ? (
              <WithTooltip
                content="Delete lobby"
                trigger={
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() =>
                      deleteLobby({ lobbyId, namespaceId, gameId })
                    }
                  >
                    <FontAwesomeIcon icon={faSkullCrossbones} />
                  </Button>
                }
              />
            ) : null}
            <WithTooltip
              trigger={
                <CopyArea
                  size="sm"
                  className="min-w-0 truncate"
                  variant="discrete"
                  value={lobbyGroupNameId}
                />
              }
              content="Lobby Group Name"
            />
            <WithTooltip
              trigger={
                <CopyArea
                  className="min-w-0 truncate"
                  variant="discrete"
                  display={lobbyId.split("-")[0]}
                  value={lobbyId}
                  size="sm"
                />
              }
              content="Lobby ID"
            />
            <Badge variant="outline">
              <LobbyRegion gameId={gameId} regionId={regionId} showLabel />
            </Badge>
          </Flex>
        </Flex>
        <Flex
          direction="col"
          gap="4"
          className="flex-1"
          items={{ initial: "start", md: "end" }}
        >
          {rightSide}
        </Flex>
      </Flex>
    </Container>
  );
}

LobbySummary.Skeleton = function LobbyLogsSummarySkeleton() {
  return (
    <Container>
      <div className="flex gap-2 items-center flex-wrap">
        <Skeleton className="mt-1 h-6 w-1/4" />
        <Skeleton className="mt-1 h-6 w-1/4" />
        <Skeleton className="mt-1 h-6 w-1/4" />
        <Skeleton className="mt-1 h-6 w-1/5" />
      </div>

      <Skeleton className="mt-3 mx-auto h-10 w-3/4" />
    </Container>
  );
};
