"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeAccountingAccount = normalizeAccountingAccount;
function normalizeAccountingAccount(value) {
    let str = String(value);
    // Remove all points
    str = str.replace(/\D/g, "");
    if (str.length < 10) {
        str = str.padEnd(10, "0");
    }
    return str;
}
