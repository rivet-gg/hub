// smithy-typescript generated code
import {
  CloudServiceClientResolvedConfig,
  ServiceInputTypes,
  ServiceOutputTypes,
} from "../CloudServiceClient";
import {
  ExportMatchmakerLobbyHistoryInput,
  ExportMatchmakerLobbyHistoryOutput,
} from "../models/models_0";
import {
  deserializeAws_restJson1ExportMatchmakerLobbyHistoryCommand,
  serializeAws_restJson1ExportMatchmakerLobbyHistoryCommand,
} from "../protocols/Aws_restJson1";
import { getSerdePlugin } from "@aws-sdk/middleware-serde";
import {
  HttpRequest as __HttpRequest,
  HttpResponse as __HttpResponse,
} from "@aws-sdk/protocol-http";
import { Command as $Command } from "@aws-sdk/smithy-client";
import {
  FinalizeHandlerArguments,
  Handler,
  HandlerExecutionContext,
  MiddlewareStack,
  HttpHandlerOptions as __HttpHandlerOptions,
  MetadataBearer as __MetadataBearer,
  SerdeContext as __SerdeContext,
} from "@aws-sdk/types";

export interface ExportMatchmakerLobbyHistoryCommandInput extends ExportMatchmakerLobbyHistoryInput {}
export interface ExportMatchmakerLobbyHistoryCommandOutput extends ExportMatchmakerLobbyHistoryOutput, __MetadataBearer {}

/**
 * Exports lobby history over a given query time span.
 * @example
 * Use a bare-bones client and the command you need to make an API call.
 * ```javascript
 * import { CloudServiceClient, ExportMatchmakerLobbyHistoryCommand } from "@rivet-gg/cloud"; // ES Modules import
 * // const { CloudServiceClient, ExportMatchmakerLobbyHistoryCommand } = require("@rivet-gg/cloud"); // CommonJS import
 * const client = new CloudServiceClient(config);
 * const command = new ExportMatchmakerLobbyHistoryCommand(input);
 * const response = await client.send(command);
 * ```
 *
 * @see {@link ExportMatchmakerLobbyHistoryCommandInput} for command's `input` shape.
 * @see {@link ExportMatchmakerLobbyHistoryCommandOutput} for command's `response` shape.
 * @see {@link CloudServiceClientResolvedConfig | config} for CloudServiceClient's `config` shape.
 *
 */
export class ExportMatchmakerLobbyHistoryCommand extends $Command<ExportMatchmakerLobbyHistoryCommandInput, ExportMatchmakerLobbyHistoryCommandOutput, CloudServiceClientResolvedConfig> {
  // Start section: command_properties
  // End section: command_properties

  constructor(readonly input: ExportMatchmakerLobbyHistoryCommandInput) {
    // Start section: command_constructor
    super();
    // End section: command_constructor
  }

  /**
   * @internal
   */
  resolveMiddleware(
    clientStack: MiddlewareStack<ServiceInputTypes, ServiceOutputTypes>,
    configuration: CloudServiceClientResolvedConfig,
    options?: __HttpHandlerOptions
  ): Handler<ExportMatchmakerLobbyHistoryCommandInput, ExportMatchmakerLobbyHistoryCommandOutput> {
    this.middlewareStack.use(getSerdePlugin(configuration, this.serialize, this.deserialize));

    const stack = clientStack.concat(this.middlewareStack);

    const { logger } = configuration;
    const clientName = "CloudServiceClient";
    const commandName = "ExportMatchmakerLobbyHistoryCommand";
    const handlerExecutionContext: HandlerExecutionContext = {
      logger,
      clientName,
      commandName,
      inputFilterSensitiveLog:
        ExportMatchmakerLobbyHistoryInput.filterSensitiveLog,
      outputFilterSensitiveLog:
        ExportMatchmakerLobbyHistoryOutput.filterSensitiveLog,
    }
    const { requestHandler } = configuration;
    return stack.resolve(
      (request: FinalizeHandlerArguments<any>) =>
        requestHandler.handle(request.request as __HttpRequest, options || {}),
      handlerExecutionContext
    );
  }

  private serialize(
    input: ExportMatchmakerLobbyHistoryCommandInput,
    context: __SerdeContext
  ): Promise<__HttpRequest> {
    return serializeAws_restJson1ExportMatchmakerLobbyHistoryCommand(input, context);
  }

  private deserialize(
    output: __HttpResponse,
    context: __SerdeContext
  ): Promise<ExportMatchmakerLobbyHistoryCommandOutput> {
    return deserializeAws_restJson1ExportMatchmakerLobbyHistoryCommand(output, context);
  }

  // Start section: command_body_extra
  // End section: command_body_extra
}
