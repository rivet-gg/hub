import { bootstrapBackendQueryOptions } from "@/domains/auth/queries/bootstrap";
import { gameBackendProjectQueryOptions } from "@/domains/game/queries";
import { Link } from "@rivet-gg/components";
import { useSuspenseQuery } from "@tanstack/react-query";

interface GameBackendDeploymentLinkProps {
  gameId: string;
  environmentNameId: string;
}

export function GameBackendDeploymentLink({
  gameId,
  environmentNameId,
}: GameBackendDeploymentLinkProps) {
  const { data: backendDomain } = useSuspenseQuery(
    bootstrapBackendQueryOptions(),
  );
  const {
    data: { project },
  } = useSuspenseQuery(gameBackendProjectQueryOptions(gameId));

  return (
    <Link
      href={`https://${project?.nameId}--${environmentNameId}.${backendDomain}`}
      target="_blank"
    >
      {project?.nameId}--{environmentNameId}.{backendDomain}
    </Link>
  );
}
