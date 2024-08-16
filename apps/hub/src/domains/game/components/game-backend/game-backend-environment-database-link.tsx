import { faDatabase, faExternalLink } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Slot } from "@radix-ui/react-slot";
import { Button, type ButtonProps } from "@rivet-gg/components";
import { useNavigate } from "@tanstack/react-router";
import { type ReactNode, forwardRef } from "react";
import { useGameBackendProjectEnvDatabasePreview } from "../../queries";

interface GameBackendEnvironmentDatabaseLinkProps
  extends Omit<ButtonProps, "onClick"> {
  gameId: string;
  environmentId: string;
  asChild?: boolean;
  children?: ReactNode;
}

export const GameBackendEnvironmentDatabaseLink = forwardRef<
  HTMLButtonElement,
  GameBackendEnvironmentDatabaseLinkProps
>(({ gameId, environmentId, asChild, children, ...props }, ref) => {
  const { isLoading, data } = useGameBackendProjectEnvDatabasePreview({
    gameId,
    environmentId,
  });

  const C = asChild ? Slot : Button;
  const navigate = useNavigate();

  return (
    <C
      ref={ref}
      onClick={async (e) => {
        e?.preventDefault();
        if (isLoading) {
          return;
        }
        if (!data) {
          return navigate({ search: { modal: "database" } });
        }
        if (typeof data === "string") {
          window.open(data, "_blank", "noreferrer,noopener");
        }
      }}
      isLoading={isLoading}
      startIcon={<FontAwesomeIcon icon={faDatabase} className={"size-4"} />}
      endIcon={
        data ? (
          <FontAwesomeIcon icon={faExternalLink} className={"size-4"} />
        ) : undefined
      }
      {...props}
    >
      {children}
    </C>
  );
});
