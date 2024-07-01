import { faDatabase } from "@fortawesome/pro-solid-svg-icons";
import { useGameBackendProjectEnvDatabasePreview } from "../../../domains/game/queries";
import { HeaderLink } from "../header-link";
import { useDialog } from "@/hooks/use-dialog";

interface HedaerBackendEnvironmentDatabaseLinkProps {
  projectId: string;
  environmentId: string;
}

export function HedaerBackendEnvironmentDatabaseLink({
  projectId,
  environmentId,
}: HedaerBackendEnvironmentDatabaseLinkProps) {
  const { dialog, open } = useDialog.ConfirmOuterbaseConnection({
    projectId,
    environmentId,
  });
  const { isLoading, data } = useGameBackendProjectEnvDatabasePreview({
    projectId,
    environmentId,
  });

  return (
    <>
      {dialog}
      <HeaderLink
        onClick={async (e) => {
          e.preventDefault();
          if (isLoading) {
            return;
          }
          if (!data) {
            return open();
          }
          if (typeof data === "string") {
            window.open(data, "_blank", "noreferrer,noopener");
          }
        }}
        isLoading={isLoading}
        icon={faDatabase}
      >
        <span className="cursor-pointer">Database</span>
      </HeaderLink>
    </>
  );
}
