// smithy-typescript generated code
import { Logger as __Logger } from "@aws-sdk/types";
import { parseUrl } from "@aws-sdk/url-parser";
import { GroupServiceClientConfig } from "./GroupServiceClient";

/**
 * @internal
 */
export const getRuntimeConfig = (config: GroupServiceClientConfig) => ({
  apiVersion: "2022-6-2",
  disableHostPrefix: config?.disableHostPrefix ?? false,
  logger: config?.logger ?? {} as __Logger,
  urlParser: config?.urlParser ?? parseUrl,
});
