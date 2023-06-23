import { CreatePartyCommandInput, CreatePartyCommandOutput } from "../commands/CreatePartyCommand";
import { CreatePartyInviteCommandInput, CreatePartyInviteCommandOutput } from "../commands/CreatePartyInviteCommand";
import { FindMatchmakerLobbyForPartyCommandInput, FindMatchmakerLobbyForPartyCommandOutput } from "../commands/FindMatchmakerLobbyForPartyCommand";
import { GetPartyFromInviteCommandInput, GetPartyFromInviteCommandOutput } from "../commands/GetPartyFromInviteCommand";
import { GetPartyProfileCommandInput, GetPartyProfileCommandOutput } from "../commands/GetPartyProfileCommand";
import { GetPartySelfProfileCommandInput, GetPartySelfProfileCommandOutput } from "../commands/GetPartySelfProfileCommand";
import { GetPartySelfSummaryCommandInput, GetPartySelfSummaryCommandOutput } from "../commands/GetPartySelfSummaryCommand";
import { GetPartySummaryCommandInput, GetPartySummaryCommandOutput } from "../commands/GetPartySummaryCommand";
import { JoinMatchmakerLobbyForPartyCommandInput, JoinMatchmakerLobbyForPartyCommandOutput } from "../commands/JoinMatchmakerLobbyForPartyCommand";
import { JoinPartyCommandInput, JoinPartyCommandOutput } from "../commands/JoinPartyCommand";
import { KickMemberCommandInput, KickMemberCommandOutput } from "../commands/KickMemberCommand";
import { LeavePartyCommandInput, LeavePartyCommandOutput } from "../commands/LeavePartyCommand";
import { MatchmakerSelfReadyCommandInput, MatchmakerSelfReadyCommandOutput } from "../commands/MatchmakerSelfReadyCommand";
import { RevokePartyInviteCommandInput, RevokePartyInviteCommandOutput } from "../commands/RevokePartyInviteCommand";
import { SendJoinRequestCommandInput, SendJoinRequestCommandOutput } from "../commands/SendJoinRequestCommand";
import { SetPartyPublicityCommandInput, SetPartyPublicityCommandOutput } from "../commands/SetPartyPublicityCommand";
import { SetPartyToIdleCommandInput, SetPartyToIdleCommandOutput } from "../commands/SetPartyToIdleCommand";
import { SetSelfInactiveCommandInput, SetSelfInactiveCommandOutput } from "../commands/SetSelfInactiveCommand";
import { TransferPartyOwnershipCommandInput, TransferPartyOwnershipCommandOutput } from "../commands/TransferPartyOwnershipCommand";
import { HttpRequest as __HttpRequest, HttpResponse as __HttpResponse } from "@aws-sdk/protocol-http";
import { SerdeContext as __SerdeContext } from "@aws-sdk/types";
export declare const serializeAws_restJson1CreatePartyCommand: (input: CreatePartyCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1CreatePartyInviteCommand: (input: CreatePartyInviteCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1GetPartyFromInviteCommand: (input: GetPartyFromInviteCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1GetPartyProfileCommand: (input: GetPartyProfileCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1GetPartySelfProfileCommand: (input: GetPartySelfProfileCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1GetPartySelfSummaryCommand: (input: GetPartySelfSummaryCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1GetPartySummaryCommand: (input: GetPartySummaryCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1JoinPartyCommand: (input: JoinPartyCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1KickMemberCommand: (input: KickMemberCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1LeavePartyCommand: (input: LeavePartyCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1RevokePartyInviteCommand: (input: RevokePartyInviteCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1SendJoinRequestCommand: (input: SendJoinRequestCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1SetPartyPublicityCommand: (input: SetPartyPublicityCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1TransferPartyOwnershipCommand: (input: TransferPartyOwnershipCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1FindMatchmakerLobbyForPartyCommand: (input: FindMatchmakerLobbyForPartyCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1JoinMatchmakerLobbyForPartyCommand: (input: JoinMatchmakerLobbyForPartyCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1MatchmakerSelfReadyCommand: (input: MatchmakerSelfReadyCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1SetPartyToIdleCommand: (input: SetPartyToIdleCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1SetSelfInactiveCommand: (input: SetSelfInactiveCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const deserializeAws_restJson1CreatePartyCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<CreatePartyCommandOutput>;
export declare const deserializeAws_restJson1CreatePartyInviteCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<CreatePartyInviteCommandOutput>;
export declare const deserializeAws_restJson1GetPartyFromInviteCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<GetPartyFromInviteCommandOutput>;
export declare const deserializeAws_restJson1GetPartyProfileCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<GetPartyProfileCommandOutput>;
export declare const deserializeAws_restJson1GetPartySelfProfileCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<GetPartySelfProfileCommandOutput>;
export declare const deserializeAws_restJson1GetPartySelfSummaryCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<GetPartySelfSummaryCommandOutput>;
export declare const deserializeAws_restJson1GetPartySummaryCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<GetPartySummaryCommandOutput>;
export declare const deserializeAws_restJson1JoinPartyCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<JoinPartyCommandOutput>;
export declare const deserializeAws_restJson1KickMemberCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<KickMemberCommandOutput>;
export declare const deserializeAws_restJson1LeavePartyCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<LeavePartyCommandOutput>;
export declare const deserializeAws_restJson1RevokePartyInviteCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<RevokePartyInviteCommandOutput>;
export declare const deserializeAws_restJson1SendJoinRequestCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<SendJoinRequestCommandOutput>;
export declare const deserializeAws_restJson1SetPartyPublicityCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<SetPartyPublicityCommandOutput>;
export declare const deserializeAws_restJson1TransferPartyOwnershipCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<TransferPartyOwnershipCommandOutput>;
export declare const deserializeAws_restJson1FindMatchmakerLobbyForPartyCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<FindMatchmakerLobbyForPartyCommandOutput>;
export declare const deserializeAws_restJson1JoinMatchmakerLobbyForPartyCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<JoinMatchmakerLobbyForPartyCommandOutput>;
export declare const deserializeAws_restJson1MatchmakerSelfReadyCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<MatchmakerSelfReadyCommandOutput>;
export declare const deserializeAws_restJson1SetPartyToIdleCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<SetPartyToIdleCommandOutput>;
export declare const deserializeAws_restJson1SetSelfInactiveCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<SetSelfInactiveCommandOutput>;
