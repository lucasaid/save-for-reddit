"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.styleText = function (text, color) {
    var colors = {
        green: "\x1b[32m",
        red: "\x1b[31m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        white: "\x1b[37m",
        underline: "\x1b[4m",
        white_underline: "\x1b[4m\x1b[37m"
    };
    return "" + colors[color] + text + "\u001B[0m";
};
