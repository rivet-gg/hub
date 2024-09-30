import logfmt from "logfmt";
import type { ComponentProps } from "react";
import { cn } from "./lib/utils";
import { Badge } from "./ui/badge";
import { WithTooltip } from "./ui/tooltip";

const Row = (props: ComponentProps<"div">) => (
  <div
    {...props}
    className="text-nowrap flex flex-col md:flex-row my-1 md:my-0 items-center "
  />
);

const Timestamp = (props: ComponentProps<"span">) => (
  <span
    {...props}
    className={cn(
      "text-muted-foreground md:my-1 font-mono text-xs p-0.5 pr-2 inline-block",
      props.className,
    )}
  />
);

const Message = (props: ComponentProps<"pre">) => (
  <pre
    {...props}
    className={cn(
      "md:my-1 font-mono text-xs p-0.5 inline-block whitespace-pre-wrap min-w-0 flex-1 break-all",
      props.className,
    )}
  />
);

export type Line = string | { type: "log" | "error" | "warn"; message: string };

interface LogRowProps {
  timestamp?: string;
  line?: Line;
  isFirst?: boolean;
}

function LogFmtRow({
  ts,
  msg,
  level,
  isError,
  isWarn,
  timestamp,
  ...props
}: Partial<Record<string, string | boolean | null>> & {
  isError: boolean;
  isWarn: boolean;
}) {
  const error = isError || level === "error";
  const warning = isWarn || level === "warning";
  return (
    <Row>
      <Timestamp
        className={cn(error && "bg-destructive/20", warning && "bg-warning/20")}
      >
        {ts || timestamp}
      </Timestamp>
      <div className="flex flex-wrap empty:hidden gap-0.5 basis-0 shrink min-w-[30%]">
        {Object.entries(props).map(([key, value]) => (
          <WithTooltip
            key={key}
            content={value}
            trigger={
              <Badge variant="outline" className="text-[0.5rem]">
                {key.toUpperCase()}
              </Badge>
            }
          />
        ))}
      </div>
      <Message>{msg}</Message>
    </Row>
  );
}

function ColoredRow({
  line,
  timestamp,
}: { timestamp?: string; line: Exclude<Line, string> }) {
  const isError = line.type === "error";
  const isWarn = line.type === "warn";

  const parsed = typeof line === "object" ? logfmt.parse(line?.message) : null;
  if (parsed && Object.keys(parsed).length > 0) {
    return (
      <LogFmtRow
        timestamp={timestamp}
        isError={isError}
        isWarn={isWarn}
        {...parsed}
      />
    );
  }

  return (
    <Row>
      <Timestamp
        className={cn(
          isError && "bg-destructive/20",
          isWarn && "bg-warning/20",
        )}
      >
        {timestamp}
      </Timestamp>
      <Message
        className={cn(
          isError && "bg-destructive/20",
          isWarn && "bg-warning/20",
        )}
      >
        {line?.message}
      </Message>
    </Row>
  );
}

export function LogRow({ timestamp, line, isFirst }: LogRowProps) {
  if (isFirst) {
    return (
      <Row>
        <Message>
          Only last few lines are visible here. To see all logs, export them.
        </Message>
      </Row>
    );
  }

  if (typeof line === "object") {
    return <ColoredRow timestamp={timestamp} line={line} />;
  }

  return (
    <Row>
      <Timestamp>{timestamp}</Timestamp>
      <Message>{line}</Message>
    </Row>
  );
}
