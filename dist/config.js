"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_PASSWORD = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.JWT_PASSWORD = process.env.JWT_PASSWORD;
