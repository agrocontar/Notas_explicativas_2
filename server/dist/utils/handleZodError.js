"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleZodError = void 0;
const zod_1 = require("zod");
const handleZodError = (err) => {
    if (err instanceof zod_1.ZodError) {
        return err.issues.map(e => ({
            field: e.path.join("."),
            message: e.message,
        }));
    }
    return [{ field: "unknown", message: "Unexpected error" }];
};
exports.handleZodError = handleZodError;
