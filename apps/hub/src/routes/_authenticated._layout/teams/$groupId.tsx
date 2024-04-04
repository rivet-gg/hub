import { groupGamesQueryOptions } from "@/queries/games";
import { GroupMembers } from "@/views/group/group-members";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Flex,
  Page,
} from "@rivet-gg/components";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";

function GroupIdView() {
  const { groupId } = Route.useParams();
  const { data } = useSuspenseQuery(groupGamesQueryOptions(groupId));

  return (
    <Page title={data.displayName}>
      <Flex direction="row" gap="4">
        <Flex w="2/3" direction="row">
          <Card>
            <CardHeader>
              <CardTitle>Games</CardTitle>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        </Flex>
        <Flex w="1/3" direction="row">
          <GroupMembers groupId={groupId} />
        </Flex>
      </Flex>
    </Page>
  );
}

export const Route = createFileRoute("/_authenticated/_layout/teams/$groupId")({
  beforeLoad: async ({ context: { queryClient }, params: { groupId } }) => {
    const data = await queryClient.ensureQueryData(
      groupGamesQueryOptions(groupId),
    );

    const group = data.groups.find((group) => group.groupId === groupId);
    if (!group) {
      throw notFound();
    }
  },
  component: GroupIdView,
});
