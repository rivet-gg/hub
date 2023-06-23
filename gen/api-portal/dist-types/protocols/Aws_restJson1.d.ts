import { GetGameProfileCommandInput, GetGameProfileCommandOutput } from "../commands/GetGameProfileCommand";
import { GetSuggestedGamesCommandInput, GetSuggestedGamesCommandOutput } from "../commands/GetSuggestedGamesCommand";
import { RegisterNotificationsCommandInput, RegisterNotificationsCommandOutput } from "../commands/RegisterNotificationsCommand";
import { ResolveBetaJoinRequestCommandInput, ResolveBetaJoinRequestCommandOutput } from "../commands/ResolveBetaJoinRequestCommand";
import { UnregisterNotificationsCommandInput, UnregisterNotificationsCommandOutput } from "../commands/UnregisterNotificationsCommand";
import { HttpRequest as __HttpRequest, HttpResponse as __HttpResponse } from "@aws-sdk/protocol-http";
import { SerdeContext as __SerdeContext } from "@aws-sdk/types";
export declare const serializeAws_restJson1GetGameProfileCommand: (input: GetGameProfileCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1GetSuggestedGamesCommand: (input: GetSuggestedGamesCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1RegisterNotificationsCommand: (input: RegisterNotificationsCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1ResolveBetaJoinRequestCommand: (input: ResolveBetaJoinRequestCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1UnregisterNotificationsCommand: (input: UnregisterNotificationsCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const deserializeAws_restJson1GetGameProfileCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<GetGameProfileCommandOutput>;
export declare const deserializeAws_restJson1GetSuggestedGamesCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<GetSuggestedGamesCommandOutput>;
export declare const deserializeAws_restJson1RegisterNotificationsCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<RegisterNotificationsCommandOutput>;
export declare const deserializeAws_restJson1ResolveBetaJoinRequestCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<ResolveBetaJoinRequestCommandOutput>;
export declare const deserializeAws_restJson1UnregisterNotificationsCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<UnregisterNotificationsCommandOutput>;
