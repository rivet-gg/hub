import { rivetEeClient } from "@/queries/global";
import type { QueryClient } from "@tanstack/react-query";
import { gameBackendProjectQueryOptions, gameQueryOptions } from "../queries";

export async function getOrCreateBackendProject(
  gameId: string,
  queryClient: QueryClient,
) {
  const { project } = await queryClient.ensureQueryData(
    gameBackendProjectQueryOptions(gameId),
  );

  if (project) {
    return { projectId: project.projectId };
  }

  const { game } = await queryClient.fetchQuery(gameQueryOptions(gameId));

  const newProject = await rivetEeClient.ee.cloud.backend.projects.create({
    displayName: `${game.displayName.slice(0, 15)}-backend`,
    developerGroupId: game.developerGroupId,
  });
  await rivetEeClient.ee.cloud.games.projects.link(gameId, {
    projectId: newProject.projectId,
  });
  return { projectId: newProject.projectId };
}
