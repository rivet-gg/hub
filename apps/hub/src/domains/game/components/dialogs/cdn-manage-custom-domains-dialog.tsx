import * as CdnNewCustomDomainForm from "@/domains/game/forms/cdn-new-custom-domain-form";
import type { DialogContentProps } from "@/hooks/use-dialog";
import { Rivet } from "@rivet-gg/api";
import {
  Badge,
  Button,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Flex,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  WithTooltip,
} from "@rivet-gg/components";
import { Icon, faInfoCircle, faPlus, faTrash } from "@rivet-gg/icons";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useCdnNewCustomDomainFormHandler } from "../../hooks/use-cdn-new-custom-domain-form-handler";
import {
  gameNamespaceQueryOptions,
  useNamespaceRemoveDomainMutation,
} from "../../queries";

const VARIANT_MAP = {
  [Rivet.cloud.CdnNamespaceDomainVerificationStatus.Active]: null,
  [Rivet.cloud.CdnNamespaceDomainVerificationStatus.Pending]:
    "secondary" as const,
  [Rivet.cloud.CdnNamespaceDomainVerificationStatus.Failed]:
    "destructive" as const,
};

interface DomainConfigRowProps extends Rivet.cloud.CdnNamespaceDomain {
  gameId: string;
  namespaceId: string;
}

function DomainConfigRow({
  domain,
  createTs,
  verificationErrors,
  verificationStatus,
  gameId,
  namespaceId,
}: DomainConfigRowProps) {
  const { mutate: removeDomain, isPending } =
    useNamespaceRemoveDomainMutation();

  return (
    <TableRow key={domain}>
      <TableCell>{domain}</TableCell>
      <TableCell>{createTs.toLocaleString()}</TableCell>
      <TableCell>
        {verificationErrors[0] ? (
          <WithTooltip
            content={verificationErrors[0]}
            trigger={
              <Badge variant={VARIANT_MAP[verificationStatus]}>
                {verificationStatus}
                <Icon icon={faInfoCircle} className="ml-2 w-3" />
              </Badge>
            }
          />
        ) : (
          <Badge variant={VARIANT_MAP[verificationStatus]}>
            {verificationStatus}
          </Badge>
        )}
      </TableCell>
      <TableCell>
        <Button
          variant="outline"
          size="icon"
          isLoading={isPending}
          onClick={() => {
            removeDomain({ gameId, namespaceId, domain });
          }}
        >
          <Icon icon={faTrash} />
        </Button>
      </TableCell>
    </TableRow>
  );
}

interface ContentProps extends DialogContentProps {
  gameId: string;
  namespaceId: string;
}

export default function CdnManageCustomDomainsDialogContent({
  gameId,
  namespaceId,
  onClose,
}: ContentProps) {
  const { data, refetch, isRefetching } = useSuspenseQuery(
    gameNamespaceQueryOptions({ gameId, namespaceId }),
  );

  const handleSubmit = useCdnNewCustomDomainFormHandler({
    namespaceId,
    gameId,
  });

  return (
    <>
      <DialogHeader>
        <DialogTitle>Manage CDN Custom Domains</DialogTitle>
      </DialogHeader>
      <CdnNewCustomDomainForm.Form
        onSubmit={handleSubmit}
        defaultValues={{ name: "" }}
      >
        <Flex gap="4" direction="row" items="start">
          <CdnNewCustomDomainForm.Name />
          <CdnNewCustomDomainForm.Submit size="icon" type="submit" mt="8">
            <Icon icon={faPlus} />
          </CdnNewCustomDomainForm.Submit>
        </Flex>
      </CdnNewCustomDomainForm.Form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.namespace.config.cdn.domains.map((domainConfig) => (
            <DomainConfigRow
              key={domainConfig.domain}
              namespaceId={namespaceId}
              gameId={gameId}
              {...domainConfig}
            />
          ))}
        </TableBody>
      </Table>
      <DialogFooter>
        <Button
          variant="secondary"
          type="button"
          onClick={() => refetch()}
          isLoading={isRefetching}
        >
          Refresh
        </Button>
        <Button type="button" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </>
  );
}
