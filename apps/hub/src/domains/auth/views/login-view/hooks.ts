import { useAuth } from "@/domains/auth/contexts/auth";
import type { SubmitHandler as FormSubmitHandler } from "@/domains/auth/forms/otp-form";
import { useCompleteEmailVerificationMutation } from "@/domains/auth/queries";
import {
  identityTokenQueryOptions,
  selfProfileQueryOptions,
} from "@/domains/user/queries";
import { Rivet } from "@rivet-gg/api";
import * as Sentry from "@sentry/react";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

const RESPONSE_MAP = {
  [Rivet.auth.CompleteStatus.SwitchIdentity]: {
    type: Rivet.auth.CompleteStatus.SwitchIdentity,
  },
  [Rivet.auth.CompleteStatus.LinkedAccountAdded]: {
    type: Rivet.auth.CompleteStatus.LinkedAccountAdded,
  },
  [Rivet.auth.CompleteStatus.AlreadyComplete]: {
    type: "error",
    message: "This verification session has already been completed.",
  },
  [Rivet.auth.CompleteStatus.Expired]: {
    type: "error",
    message: "This verification session has expired. Please try again.",
  },
  [Rivet.auth.CompleteStatus.TooManyAttempts]: {
    type: "error",
    message: "Too many failed attempts. Try again later.",
  },
  [Rivet.auth.CompleteStatus.Incorrect]: {
    type: "error",
    message: "The verification code given is incorrect.",
  },
  default: {
    type: "error",
    message: "Unknown error",
  },
} as const;

export interface OtpFormSubmitHandlerArgs {
  verificationId: string | undefined;
  onSuccess?: () => void;
}

export const useOtpFormSubmitHandler = ({
  onSuccess,
  verificationId,
}: OtpFormSubmitHandlerArgs) => {
  const queryClient = useQueryClient();
  const { refreshToken } = useAuth();
  const { mutateAsync } = useCompleteEmailVerificationMutation();

  const callback: FormSubmitHandler = useCallback(
    async (values, form) => {
      if (!verificationId) {
        return form.setError("otp", {
          type: "manual",
          message: "Unknown error. Please try again.",
        });
      }
      try {
        const response = await mutateAsync({
          verificationId,
          code: values.otp,
        });

        const translatedResponse =
          RESPONSE_MAP[response.status] || RESPONSE_MAP.default;

        if (translatedResponse.type === "error") {
          return form.setError("otp", {
            type: "manual",
            message: translatedResponse.message,
          });
        }

        if (
          translatedResponse.type === Rivet.auth.CompleteStatus.SwitchIdentity
        ) {
          queryClient.removeQueries({
            predicate(query) {
              return (
                query.queryKey !== selfProfileQueryOptions().queryKey &&
                query.queryKey !== identityTokenQueryOptions().queryKey
              );
            },
          });
          await refreshToken();
          return onSuccess?.();
        }

        return onSuccess?.();
      } catch (error) {
        Sentry.captureException(error);
        return form.setError("otp", {
          type: "manual",
          message: "Invalid verification code",
        });
      }
    },
    [
      refreshToken,
      mutateAsync,
      onSuccess,
      verificationId,
      queryClient.removeQueries,
    ],
  );

  return callback;
};
