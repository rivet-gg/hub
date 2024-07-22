import type { DialogContentProps } from "@/hooks/use-dialog";
import {
  Button,
  CopyArea,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Flex,
  Text,
} from "@rivet-gg/components";
import { useSuspenseQuery } from "@tanstack/react-query";
import { gameTokenServiceQueryOptions } from "../../queries";

interface ContentProps extends DialogContentProps {
  gameId: string;
}

export default function GameGenerateServiceTokenDialogContent({
  gameId,
  onClose,
}: ContentProps) {
  const { data } = useSuspenseQuery(gameTokenServiceQueryOptions({ gameId }));
  return (
    <>
      <DialogHeader>
        <DialogTitle>Create Game Service Token</DialogTitle>
      </DialogHeader>
      <Flex gap="4" direction="col">
        <Text>
          Copy this token to your clipboard. You will not be able to access this
          token again.
        </Text>
        <CopyArea value={data} isConfidential />
      </Flex>
      <DialogFooter>
        <Button onClick={onClose}>Close</Button>
      </DialogFooter>
    </>
  );
}
