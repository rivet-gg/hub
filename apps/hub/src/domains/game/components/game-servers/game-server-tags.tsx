import { Badge } from "@rivet-gg/components";

interface GameServerTagsProps {
  tags?: unknown;
}

export function GameServerTags({ tags = {} }: GameServerTagsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags && typeof tags === "object"
        ? Object.entries(tags).map(([key, value]) => (
            <Badge key={key} variant="outline">
              {key}={value}
            </Badge>
          ))
        : null}
    </div>
  );
}
