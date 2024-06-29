import { queryOptions } from "@tanstack/react-query";
import { rivetClient } from "../../../queries/global";

export const bootstrapQueryOptions = ({
  enabled,
}: { enabled?: boolean } = {}) => {
  return queryOptions({
    queryKey: ["bootstrap"],
    queryFn: () => rivetClient.cloud.bootstrap(),
    enabled,
  });
};

export const bootstrapBackendQueryOptions = () => {
  return queryOptions({
    ...bootstrapQueryOptions(),
    select: (data) =>
      data.domains?.opengb || data.domains?.main || window.location.host,
  });
};

export const bootstrapCaptchaQueryOptions = () => {
  return queryOptions({
    ...bootstrapQueryOptions(),
    select: (data) => data.captcha,
  });
};
