import { faChevronRight } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Badge,
  RelativeTime,
  WithTooltip,
  cn,
  formatDuration,
} from "@rivet-gg/components";
import { type PropsWithChildren, forwardRef } from "react";

const Separator = forwardRef<HTMLButtonElement, { isActive?: boolean }>(
  ({ isActive, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className="mx-1 md:p-2 md:mx-2 cursor-default"
        {...rest}
      >
        <FontAwesomeIcon
          icon={faChevronRight}
          className={cn(isActive && "text-primary")}
        />
      </button>
    );
  },
);

const Trigger = forwardRef<HTMLButtonElement, PropsWithChildren>(
  ({ children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className="py-2 cursor-default flex flex-col gap-1 items-center"
        {...props}
      >
        {children}
      </button>
    );
  },
);

const Details = ({ children }: PropsWithChildren) => {
  return <p className="text-xs">{children}</p>;
};

interface LobbyLifecycleProps {
  createTs: Date;
  readyTs?: Date;
  stopTs?: Date;
}

export function LobbyLifecycle({
  createTs,
  readyTs,
  stopTs,
}: LobbyLifecycleProps) {
  return (
    <div className="flex text-sm gap w-full md:justify-end relative">
      <div className="relative md:gap-0 gap-1 flex items-center">
        <WithTooltip
          content={createTs.toLocaleString()}
          trigger={
            <Trigger>
              <Badge
                variant={!readyTs && !stopTs ? "default" : "outline"}
                className="border-primary"
              >
                Create
              </Badge>
              <Details>
                <RelativeTime time={createTs} />
              </Details>
            </Trigger>
          }
        />

        {readyTs && !stopTs ? (
          <>
            <Separator isActive />
            <WithTooltip
              content={
                <>
                  {formatDuration(readyTs.getTime() - createTs.getTime(), {
                    showSeconds: true,
                    showMilliseconds: true,
                  })}{" "}
                  since create
                </>
              }
              trigger={
                <Trigger>
                  <Badge variant="default" className="border-primary">
                    Ready
                  </Badge>
                  <Details>{readyTs.toLocaleString()}</Details>
                </Trigger>
              }
            />
          </>
        ) : readyTs && stopTs ? (
          <>
            <Separator isActive />
            <WithTooltip
              content={
                <>
                  {readyTs.toLocaleString()}
                  <br />
                  {formatDuration(readyTs.getTime() - createTs.getTime(), {
                    showSeconds: true,
                    showMilliseconds: true,
                  })}{" "}
                  since create
                </>
              }
              trigger={
                <Trigger>
                  <Badge
                    variant="outline"
                    className="border-primary cursor-default"
                  >
                    Ready
                  </Badge>
                  <Details>
                    {stopTs && readyTs
                      ? formatDuration(stopTs.getTime() - readyTs.getTime(), {
                          showSeconds: true,
                        })
                      : ""}
                  </Details>
                </Trigger>
              }
            />
          </>
        ) : (
          <>
            <Separator isActive={!!readyTs} />
            <Trigger>
              <Badge
                variant="outline"
                className={cn(!!readyTs && "border-primary", "cursor-default")}
              >
                Ready
              </Badge>
              <Details>
                {stopTs && readyTs
                  ? formatDuration(stopTs.getTime() - readyTs.getTime(), {
                      showSeconds: true,
                    })
                  : ""}
              </Details>
            </Trigger>
          </>
        )}

        {stopTs ? (
          <>
            <Separator isActive />
            <WithTooltip
              content={
                <>
                  {stopTs.toLocaleString()}
                  <br />
                  {formatDuration(stopTs.getTime() - createTs.getTime(), {
                    showSeconds: true,
                    showMilliseconds: true,
                  })}{" "}
                  since create
                </>
              }
              trigger={
                <Trigger>
                  <Badge variant="default" className="border-primary">
                    Stop
                  </Badge>
                  <Details>
                    <RelativeTime time={stopTs} />
                  </Details>
                </Trigger>
              }
            />
          </>
        ) : (
          <>
            <Separator />
            <Trigger>
              <Badge variant="outline" className="cursor-default">
                Stop
              </Badge>
              <Details />
            </Trigger>
          </>
        )}
      </div>
    </div>
  );
}
