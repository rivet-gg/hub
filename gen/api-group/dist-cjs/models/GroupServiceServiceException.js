"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupServiceServiceException = void 0;
const smithy_client_1 = require("@aws-sdk/smithy-client");
class GroupServiceServiceException extends smithy_client_1.ServiceException {
    constructor(options) {
        super(options);
        Object.setPrototypeOf(this, GroupServiceServiceException.prototype);
    }
}
exports.GroupServiceServiceException = GroupServiceServiceException;
