import { GetDirectThreadCommandInput, GetDirectThreadCommandOutput } from "../commands/GetDirectThreadCommand";
import { GetThreadHistoryCommandInput, GetThreadHistoryCommandOutput } from "../commands/GetThreadHistoryCommand";
import { GetThreadTopicCommandInput, GetThreadTopicCommandOutput } from "../commands/GetThreadTopicCommand";
import { SendChatMessageCommandInput, SendChatMessageCommandOutput } from "../commands/SendChatMessageCommand";
import { SetThreadReadCommandInput, SetThreadReadCommandOutput } from "../commands/SetThreadReadCommand";
import { SetTypingStatusCommandInput, SetTypingStatusCommandOutput } from "../commands/SetTypingStatusCommand";
import { WatchThreadCommandInput, WatchThreadCommandOutput } from "../commands/WatchThreadCommand";
import { HttpRequest as __HttpRequest, HttpResponse as __HttpResponse } from "@aws-sdk/protocol-http";
import { SerdeContext as __SerdeContext } from "@aws-sdk/types";
export declare const serializeAws_restJson1GetDirectThreadCommand: (input: GetDirectThreadCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1GetThreadHistoryCommand: (input: GetThreadHistoryCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1GetThreadTopicCommand: (input: GetThreadTopicCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1SendChatMessageCommand: (input: SendChatMessageCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1SetThreadReadCommand: (input: SetThreadReadCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1SetTypingStatusCommand: (input: SetTypingStatusCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const serializeAws_restJson1WatchThreadCommand: (input: WatchThreadCommandInput, context: __SerdeContext) => Promise<__HttpRequest>;
export declare const deserializeAws_restJson1GetDirectThreadCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<GetDirectThreadCommandOutput>;
export declare const deserializeAws_restJson1GetThreadHistoryCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<GetThreadHistoryCommandOutput>;
export declare const deserializeAws_restJson1GetThreadTopicCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<GetThreadTopicCommandOutput>;
export declare const deserializeAws_restJson1SendChatMessageCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<SendChatMessageCommandOutput>;
export declare const deserializeAws_restJson1SetThreadReadCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<SetThreadReadCommandOutput>;
export declare const deserializeAws_restJson1SetTypingStatusCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<SetTypingStatusCommandOutput>;
export declare const deserializeAws_restJson1WatchThreadCommand: (output: __HttpResponse, context: __SerdeContext) => Promise<WatchThreadCommandOutput>;
