import { CloudServiceClientResolvedConfig, ServiceInputTypes, ServiceOutputTypes } from "../CloudServiceClient";
import { CreateGameNamespaceInput, CreateGameNamespaceOutput } from "../models/models_0";
import { Command as $Command } from "@aws-sdk/smithy-client";
import { Handler, MiddlewareStack, HttpHandlerOptions as __HttpHandlerOptions, MetadataBearer as __MetadataBearer } from "@aws-sdk/types";
export interface CreateGameNamespaceCommandInput extends CreateGameNamespaceInput {
}
export interface CreateGameNamespaceCommandOutput extends CreateGameNamespaceOutput, __MetadataBearer {
}
/**
 * Creates a new namespace for the given game.
 * @example
 * Use a bare-bones client and the command you need to make an API call.
 * ```javascript
 * import { CloudServiceClient, CreateGameNamespaceCommand } from "@rivet-gg/cloud"; // ES Modules import
 * // const { CloudServiceClient, CreateGameNamespaceCommand } = require("@rivet-gg/cloud"); // CommonJS import
 * const client = new CloudServiceClient(config);
 * const command = new CreateGameNamespaceCommand(input);
 * const response = await client.send(command);
 * ```
 *
 * @see {@link CreateGameNamespaceCommandInput} for command's `input` shape.
 * @see {@link CreateGameNamespaceCommandOutput} for command's `response` shape.
 * @see {@link CloudServiceClientResolvedConfig | config} for CloudServiceClient's `config` shape.
 *
 */
export declare class CreateGameNamespaceCommand extends $Command<CreateGameNamespaceCommandInput, CreateGameNamespaceCommandOutput, CloudServiceClientResolvedConfig> {
    readonly input: CreateGameNamespaceCommandInput;
    constructor(input: CreateGameNamespaceCommandInput);
    /**
     * @internal
     */
    resolveMiddleware(clientStack: MiddlewareStack<ServiceInputTypes, ServiceOutputTypes>, configuration: CloudServiceClientResolvedConfig, options?: __HttpHandlerOptions): Handler<CreateGameNamespaceCommandInput, CreateGameNamespaceCommandOutput>;
    private serialize;
    private deserialize;
}
