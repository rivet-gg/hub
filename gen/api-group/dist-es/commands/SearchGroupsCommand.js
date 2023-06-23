import { __extends } from "tslib";
import { SearchGroupsInput, SearchGroupsOutput, } from "../models/models_0";
import { deserializeAws_restJson1SearchGroupsCommand, serializeAws_restJson1SearchGroupsCommand, } from "../protocols/Aws_restJson1";
import { getSerdePlugin } from "@aws-sdk/middleware-serde";
import { Command as $Command } from "@aws-sdk/smithy-client";
var SearchGroupsCommand = (function (_super) {
    __extends(SearchGroupsCommand, _super);
    function SearchGroupsCommand(input) {
        var _this = _super.call(this) || this;
        _this.input = input;
        return _this;
    }
    SearchGroupsCommand.prototype.resolveMiddleware = function (clientStack, configuration, options) {
        this.middlewareStack.use(getSerdePlugin(configuration, this.serialize, this.deserialize));
        var stack = clientStack.concat(this.middlewareStack);
        var logger = configuration.logger;
        var clientName = "GroupServiceClient";
        var commandName = "SearchGroupsCommand";
        var handlerExecutionContext = {
            logger: logger,
            clientName: clientName,
            commandName: commandName,
            inputFilterSensitiveLog: SearchGroupsInput.filterSensitiveLog,
            outputFilterSensitiveLog: SearchGroupsOutput.filterSensitiveLog,
        };
        var requestHandler = configuration.requestHandler;
        return stack.resolve(function (request) {
            return requestHandler.handle(request.request, options || {});
        }, handlerExecutionContext);
    };
    SearchGroupsCommand.prototype.serialize = function (input, context) {
        return serializeAws_restJson1SearchGroupsCommand(input, context);
    };
    SearchGroupsCommand.prototype.deserialize = function (output, context) {
        return deserializeAws_restJson1SearchGroupsCommand(output, context);
    };
    return SearchGroupsCommand;
}($Command));
export { SearchGroupsCommand };
