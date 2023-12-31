import { CreatePartyCommandInput, CreatePartyCommandOutput } from "./commands/CreatePartyCommand";
import { CreatePartyInviteCommandInput, CreatePartyInviteCommandOutput } from "./commands/CreatePartyInviteCommand";
import { FindMatchmakerLobbyForPartyCommandInput, FindMatchmakerLobbyForPartyCommandOutput } from "./commands/FindMatchmakerLobbyForPartyCommand";
import { GetPartyFromInviteCommandInput, GetPartyFromInviteCommandOutput } from "./commands/GetPartyFromInviteCommand";
import { GetPartyProfileCommandInput, GetPartyProfileCommandOutput } from "./commands/GetPartyProfileCommand";
import { GetPartySelfProfileCommandInput, GetPartySelfProfileCommandOutput } from "./commands/GetPartySelfProfileCommand";
import { GetPartySelfSummaryCommandInput, GetPartySelfSummaryCommandOutput } from "./commands/GetPartySelfSummaryCommand";
import { GetPartySummaryCommandInput, GetPartySummaryCommandOutput } from "./commands/GetPartySummaryCommand";
import { JoinMatchmakerLobbyForPartyCommandInput, JoinMatchmakerLobbyForPartyCommandOutput } from "./commands/JoinMatchmakerLobbyForPartyCommand";
import { JoinPartyCommandInput, JoinPartyCommandOutput } from "./commands/JoinPartyCommand";
import { KickMemberCommandInput, KickMemberCommandOutput } from "./commands/KickMemberCommand";
import { LeavePartyCommandInput, LeavePartyCommandOutput } from "./commands/LeavePartyCommand";
import { MatchmakerSelfReadyCommandInput, MatchmakerSelfReadyCommandOutput } from "./commands/MatchmakerSelfReadyCommand";
import { RevokePartyInviteCommandInput, RevokePartyInviteCommandOutput } from "./commands/RevokePartyInviteCommand";
import { SendJoinRequestCommandInput, SendJoinRequestCommandOutput } from "./commands/SendJoinRequestCommand";
import { SetPartyPublicityCommandInput, SetPartyPublicityCommandOutput } from "./commands/SetPartyPublicityCommand";
import { SetPartyToIdleCommandInput, SetPartyToIdleCommandOutput } from "./commands/SetPartyToIdleCommand";
import { SetSelfInactiveCommandInput, SetSelfInactiveCommandOutput } from "./commands/SetSelfInactiveCommand";
import { TransferPartyOwnershipCommandInput, TransferPartyOwnershipCommandOutput } from "./commands/TransferPartyOwnershipCommand";
import { CustomEndpointsInputConfig, CustomEndpointsResolvedConfig } from "@aws-sdk/config-resolver";
import { HostHeaderInputConfig, HostHeaderResolvedConfig } from "@aws-sdk/middleware-host-header";
import { RetryInputConfig, RetryResolvedConfig } from "@aws-sdk/middleware-retry";
import { UserAgentInputConfig, UserAgentResolvedConfig } from "@aws-sdk/middleware-user-agent";
import { HttpHandler as __HttpHandler } from "@aws-sdk/protocol-http";
import { DefaultsMode, Client as __Client, SmithyConfiguration as __SmithyConfiguration, SmithyResolvedConfiguration as __SmithyResolvedConfiguration } from "@aws-sdk/smithy-client";
import { Provider, BodyLengthCalculator as __BodyLengthCalculator, Decoder as __Decoder, Encoder as __Encoder, HashConstructor as __HashConstructor, HttpHandlerOptions as __HttpHandlerOptions, Logger as __Logger, Provider as __Provider, StreamCollector as __StreamCollector, UrlParser as __UrlParser, UserAgent as __UserAgent } from "@aws-sdk/types";
export declare type ServiceInputTypes = CreatePartyCommandInput | CreatePartyInviteCommandInput | FindMatchmakerLobbyForPartyCommandInput | GetPartyFromInviteCommandInput | GetPartyProfileCommandInput | GetPartySelfProfileCommandInput | GetPartySelfSummaryCommandInput | GetPartySummaryCommandInput | JoinMatchmakerLobbyForPartyCommandInput | JoinPartyCommandInput | KickMemberCommandInput | LeavePartyCommandInput | MatchmakerSelfReadyCommandInput | RevokePartyInviteCommandInput | SendJoinRequestCommandInput | SetPartyPublicityCommandInput | SetPartyToIdleCommandInput | SetSelfInactiveCommandInput | TransferPartyOwnershipCommandInput;
export declare type ServiceOutputTypes = CreatePartyCommandOutput | CreatePartyInviteCommandOutput | FindMatchmakerLobbyForPartyCommandOutput | GetPartyFromInviteCommandOutput | GetPartyProfileCommandOutput | GetPartySelfProfileCommandOutput | GetPartySelfSummaryCommandOutput | GetPartySummaryCommandOutput | JoinMatchmakerLobbyForPartyCommandOutput | JoinPartyCommandOutput | KickMemberCommandOutput | LeavePartyCommandOutput | MatchmakerSelfReadyCommandOutput | RevokePartyInviteCommandOutput | SendJoinRequestCommandOutput | SetPartyPublicityCommandOutput | SetPartyToIdleCommandOutput | SetSelfInactiveCommandOutput | TransferPartyOwnershipCommandOutput;
export interface ClientDefaults extends Partial<__SmithyResolvedConfiguration<__HttpHandlerOptions>> {
    /**
     * The HTTP handler to use. Fetch in browser and Https in Nodejs.
     */
    requestHandler?: __HttpHandler;
    /**
     * A constructor for a class implementing the {@link __Hash} interface
     * that computes the SHA-256 HMAC or checksum of a string or binary buffer.
     * @internal
     */
    sha256?: __HashConstructor;
    /**
     * The function that will be used to convert strings into HTTP endpoints.
     * @internal
     */
    urlParser?: __UrlParser;
    /**
     * A function that can calculate the length of a request body.
     * @internal
     */
    bodyLengthChecker?: __BodyLengthCalculator;
    /**
     * A function that converts a stream into an array of bytes.
     * @internal
     */
    streamCollector?: __StreamCollector;
    /**
     * The function that will be used to convert a base64-encoded string to a byte array.
     * @internal
     */
    base64Decoder?: __Decoder;
    /**
     * The function that will be used to convert binary data to a base64-encoded string.
     * @internal
     */
    base64Encoder?: __Encoder;
    /**
     * The function that will be used to convert a UTF8-encoded string to a byte array.
     * @internal
     */
    utf8Decoder?: __Decoder;
    /**
     * The function that will be used to convert binary data to a UTF-8 encoded string.
     * @internal
     */
    utf8Encoder?: __Encoder;
    /**
     * The runtime environment.
     * @internal
     */
    runtime?: string;
    /**
     * Disable dyanamically changing the endpoint of the client based on the hostPrefix
     * trait of an operation.
     */
    disableHostPrefix?: boolean;
    /**
     * Bearer token for auth.
     */
    token?: string;
    /**
     * Value for how many times a request will be made at most in case of retry.
     */
    maxAttempts?: number | __Provider<number>;
    /**
     * Specifies which retry algorithm to use.
     */
    retryMode?: string | __Provider<string>;
    /**
     * Optional logger for logging debug/info/warn/error.
     */
    logger?: __Logger;
    /**
     * Enables IPv6/IPv4 dualstack endpoint.
     */
    useDualstackEndpoint?: boolean | __Provider<boolean>;
    /**
     * Enables FIPS compatible endpoints.
     */
    useFipsEndpoint?: boolean | __Provider<boolean>;
    /**
     * The provider populating default tracking information to be sent with `user-agent`, `x-amz-user-agent` header
     * @internal
     */
    defaultUserAgentProvider?: Provider<__UserAgent>;
    /**
     * The {@link DefaultsMode} that will be used to determine how certain default configuration options are resolved in the SDK.
     */
    defaultsMode?: DefaultsMode | Provider<DefaultsMode>;
}
declare type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
declare type PartyServiceClientConfigType = PartialBy<Partial<__SmithyConfiguration<__HttpHandlerOptions>> & ClientDefaults & CustomEndpointsInputConfig & RetryInputConfig & HostHeaderInputConfig & UserAgentInputConfig, "endpoint">;
/**
 * The configuration interface of PartyServiceClient class constructor that set the region, credentials and other options.
 */
export interface PartyServiceClientConfig extends PartyServiceClientConfigType {
}
declare type PartyServiceClientResolvedConfigType = __SmithyResolvedConfiguration<__HttpHandlerOptions> & Required<ClientDefaults> & CustomEndpointsResolvedConfig & RetryResolvedConfig & HostHeaderResolvedConfig & UserAgentResolvedConfig;
/**
 * The resolved configuration interface of PartyServiceClient class. This is resolved and normalized from the {@link PartyServiceClientConfig | constructor configuration interface}.
 */
export interface PartyServiceClientResolvedConfig extends PartyServiceClientResolvedConfigType {
}
export declare class PartyServiceClient extends __Client<__HttpHandlerOptions, ServiceInputTypes, ServiceOutputTypes, PartyServiceClientResolvedConfig> {
    /**
     * The resolved configuration of PartyServiceClient class. This is resolved and normalized from the {@link PartyServiceClientConfig | constructor configuration interface}.
     */
    readonly config: PartyServiceClientResolvedConfig;
    constructor(configuration: PartyServiceClientConfig);
    /**
     * Destroy underlying resources, like sockets. It's usually not necessary to do this.
     * However in Node.js, it's best to explicitly shut down the client's agent when it is no longer needed.
     * Otherwise, sockets might stay open for quite a long time before the server terminates them.
     */
    destroy(): void;
}
export {};
