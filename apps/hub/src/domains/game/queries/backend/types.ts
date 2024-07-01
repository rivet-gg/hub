import { z } from "zod";

function parseModuleCallUrl(url: string) {
  const [modulesLiteral, moduleName, scriptsLiteral, scriptName, callLiteral] =
    url.split("/").slice(1);

  if (
    modulesLiteral === "modules" &&
    scriptsLiteral === "scripts" &&
    callLiteral === "call"
  ) {
    return {
      moduleName,
      scriptName,
    };
  }

  return null;
}

export const BackendEvent = z
  .object({
    dispatchNamespace: z.string(),
    event: z.object({
      request: z.object({
        headers: z.record(z.string()),
        method: z.string(),
        url: z.string(),
      }),
      response: z.object({
        status: z.number(),
      }),
    }),
    eventTimestamp: z.string(),
    logs: z.array(
      z.object({
        level: z.string(),
        message: z.array(z.string()),
        timestamp: z.string(),
      }),
    ),
    exceptions: z
      .array(
        z.object({
          stack: z.string(),
          message: z.string(),
          timestamp: z.string(),
        }),
      )
      .optional(),
    outcome: z.string(),
    scriptName: z.string(),
    scriptVersion: z.object({
      id: z.string(),
    }),
  })
  .transform((data) => {
    const url = new URL(data.event.request.url);

    return {
      ...data,
      backendCall: parseModuleCallUrl(url.pathname),
      event: {
        ...data.event,
        request: {
          ...data.event.request,
          pathname: url.pathname,
        },
      },
      logTimestamps: [
        ...data.logs.map((log) => new Date(+log.timestamp).toISOString()),
        ...(data.exceptions?.map((log) =>
          new Date(+log.timestamp).toISOString(),
        ) ?? []),
      ],
      logs: [
        ...data.logs.map((log) => ({
          type: "log" as const,
          message: log.message.join("\n"),
        })),
        ...(data.exceptions?.map((log) => ({
          type: "error" as const,
          message: [log.message, log.stack].join("\n"),
        })) ?? []),
      ],
    };
  });

export type BackendEvent = z.infer<typeof BackendEvent>;

export const OuterbaseStarlinkResponse = z.object({
  response: z.object({
    url: z.string(),
  }),
});
export type OuterbaseStarlinkResponse = z.infer<
  typeof OuterbaseStarlinkResponse
>;
