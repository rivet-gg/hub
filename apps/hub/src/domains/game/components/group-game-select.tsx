import { groupGamesQueryOptions } from "@/domains/game/queries";
import {
  AssetImage,
  Flex,
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@rivet-gg/components";
import { Icon, faCirclePlus } from "@rivet-gg/icons";
import { useSuspenseQuery } from "@tanstack/react-query";
import { type ComponentProps, useCallback } from "react";

interface GroupGameSelectProps extends ComponentProps<typeof Select> {
  groupId: string;
  showCreateGame?: boolean;
  onCreateClick?: () => void;
}

export function GroupGameSelect({
  groupId,
  showCreateGame,
  onCreateClick,
  onValueChange,
  ...props
}: GroupGameSelectProps) {
  const { data } = useSuspenseQuery(groupGamesQueryOptions(groupId));

  const handleValueChange = useCallback(
    (value: string) => {
      if (value === "create") {
        onCreateClick?.();
        return;
      }
      onValueChange?.(value);
    },
    [onCreateClick, onValueChange],
  );

  return (
    <Select onValueChange={handleValueChange} {...props}>
      <SelectTrigger>
        <SelectValue placeholder="Select game..." />
      </SelectTrigger>
      <SelectContent>
        {showCreateGame ? (
          <>
            <SelectItem value="create">
              <Flex gap="2" items="center">
                <Icon className="size-4" icon={faCirclePlus} />
                Create new game
              </Flex>
            </SelectItem>
            <SelectSeparator />
          </>
        ) : null}
        {data.games.map((game) => (
          <SelectItem key={game.gameId} value={game.gameId}>
            <Flex gap="2" items="center">
              <AssetImage
                src={game.logoUrl || "/games/blank/blankgame.svg"}
                className="mx-auto size-5 object-contain"
                alt="Game logo"
              />
              {game.displayName}
            </Flex>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
