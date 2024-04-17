"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = exports.EventRoute = void 0;
// Routes V1
const event_controller_1 = __importDefault(require("./v1/event.controller"));
exports.EventRoute = event_controller_1.default;
const user_controller_1 = __importDefault(require("./v1/user.controller"));
exports.UserRoute = user_controller_1.default;
