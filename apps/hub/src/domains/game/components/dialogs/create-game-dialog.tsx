import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Flex,
} from "@rivet-gg/components";
import * as GameCreateForm from "@/domains/game/forms/game-create-form";
import { useGameCreateMutation } from "../../queries";
import { convertStringToId } from "@/lib/utils";
import { Rivet } from "@rivet-gg/api";

interface CreateGameDialogContentProps {
  onSuccess?: (data: Rivet.cloud.games.CreateGameResponse) => void;
}

export default function CreateGameDialogContent({
  onSuccess,
}: CreateGameDialogContentProps) {
  const { mutateAsync } = useGameCreateMutation({
    onSuccess,
  });

  return (
    <>
      <GameCreateForm.Form
        onSubmit={async ({ name, slug, developerGroupId }) => {
          await mutateAsync({
            developerGroupId,
            displayName: name,
            nameId: slug || convertStringToId(name),
          });
        }}
        defaultValues={{ name: "", slug: "", developerGroupId: "" }}
      >
        <DialogHeader>
          <DialogTitle>Create New Game</DialogTitle>
        </DialogHeader>
        <Flex gap="4" direction="col">
          <GameCreateForm.Group />
          <GameCreateForm.Name />
          <GameCreateForm.Slug />
        </Flex>
        <DialogFooter>
          <GameCreateForm.Submit type="submit">Create</GameCreateForm.Submit>
        </DialogFooter>
      </GameCreateForm.Form>
    </>
  );
}
