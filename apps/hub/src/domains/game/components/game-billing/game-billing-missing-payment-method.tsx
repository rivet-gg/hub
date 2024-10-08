import {
  Alert,
  AlertDescription,
  AlertTitle,
  Flex,
} from "@rivet-gg/components";
import { Icon, faCreditCard } from "@rivet-gg/icons";
import { GameBillingHeader } from "./game-billing-header";
import { GameBillingPortalButton } from "./game-billing-portal-button";

interface GameBillingMissingPaymentMethodProps {
  groupId: string;
  gameId: string;
}

export function GameBillingMissingPaymentMethod({
  groupId,
  gameId,
}: GameBillingMissingPaymentMethodProps) {
  return (
    <>
      <GameBillingHeader gameId={gameId} />
      <Alert>
        <Icon className="size-4" icon={faCreditCard} />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          <Flex direction="col" items="start" gap="4">
            You must add a payment method before you can add servers to your
            project.
            <GameBillingPortalButton
              intent="payment_method_update"
              groupId={groupId}
            >
              Add payment method
            </GameBillingPortalButton>
          </Flex>
        </AlertDescription>
      </Alert>
    </>
  );
}
