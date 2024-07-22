import type { Rivet } from "@rivet-gg/api";
import {
  Badge,
  Code,
  Dd,
  Dl,
  Dt,
  Flex,
  ScrollArea,
} from "@rivet-gg/components";
import { Fragment } from "react/jsx-runtime";

interface GameServerNetworkTabProps
  extends Pick<Rivet.servers.Server, "network"> {}

export function GameServerNetworkTab({ network }: GameServerNetworkTabProps) {
  return (
    <ScrollArea className="overflow-auto h-full px-4 my-2">
      <Flex gap="2" direction="col">
        <Dl>
          <Dt>Mode</Dt>
          <Dd>
            <Code>{network.mode}</Code>
          </Dd>
        </Dl>
        <Dt asChild>
          <p>Ports</p>
        </Dt>
        <Dl className="ml-5" asChild>
          <div>
            {Object.entries(network.ports).map(([name, config]) => (
              <Fragment key={name}>
                <Dt>{name}</Dt>
                <Dd>
                  {config.routing.gameGuard ? (
                    <Badge variant="secondary">GameGuard</Badge>
                  ) : null}
                  {config.routing.host ? (
                    <Badge variant="secondary">Host</Badge>
                  ) : null}
                </Dd>
                <Dl className="col-span-2 ml-5">
                  <Dt>Protocol</Dt>
                  <Dd>{config.protocol}</Dd>
                </Dl>
                <Dl className="col-span-2 ml-5">
                  <Dt>Internal port</Dt>
                  <Dd>{config.internalPort || "-"}</Dd>
                </Dl>
                <Dl className="col-span-2 ml-5">
                  <Dt>Public port</Dt>
                  <Dd>{config.publicPort || "-"}</Dd>
                </Dl>
                <Dl className="col-span-2 ml-5">
                  <Dt>Public hostname</Dt>
                  <Dd>{config.publicHostname || "-"}</Dd>
                </Dl>
              </Fragment>
            ))}
          </div>
        </Dl>
      </Flex>
    </ScrollArea>
  );
}
