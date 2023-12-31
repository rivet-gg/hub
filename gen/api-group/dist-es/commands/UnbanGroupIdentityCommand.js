import { __extends } from "tslib";
import { UnbanGroupIdentityInput, UnbanGroupIdentityOutput, } from "../models/models_0";
import { deserializeAws_restJson1UnbanGroupIdentityCommand, serializeAws_restJson1UnbanGroupIdentityCommand, } from "../protocols/Aws_restJson1";
import { getSerdePlugin } from "@aws-sdk/middleware-serde";
import { Command as $Command } from "@aws-sdk/smithy-client";
var UnbanGroupIdentityCommand = (function (_super) {
    __extends(UnbanGroupIdentityCommand, _super);
    function UnbanGroupIdentityCommand(input) {
        var _this = _super.call(this) || this;
        _this.input = input;
        return _this;
    }
    UnbanGroupIdentityCommand.prototype.resolveMiddleware = function (clientStack, configuration, options) {
        this.middlewareStack.use(getSerdePlugin(configuration, this.serialize, this.deserialize));
        var stack = clientStack.concat(this.middlewareStack);
        var logger = configuration.logger;
        var clientName = "GroupServiceClient";
        var commandName = "UnbanGroupIdentityCommand";
        var handlerExecutionContext = {
            logger: logger,
            clientName: clientName,
            commandName: commandName,
            inputFilterSensitiveLog: UnbanGroupIdentityInput.filterSensitiveLog,
            outputFilterSensitiveLog: UnbanGroupIdentityOutput.filterSensitiveLog,
        };
        var requestHandler = configuration.requestHandler;
        return stack.resolve(function (request) {
            return requestHandler.handle(request.request, options || {});
        }, handlerExecutionContext);
    };
    UnbanGroupIdentityCommand.prototype.serialize = function (input, context) {
        return serializeAws_restJson1UnbanGroupIdentityCommand(input, context);
    };
    UnbanGroupIdentityCommand.prototype.deserialize = function (output, context) {
        return deserializeAws_restJson1UnbanGroupIdentityCommand(output, context);
    };
    return UnbanGroupIdentityCommand;
}($Command));
export { UnbanGroupIdentityCommand };
