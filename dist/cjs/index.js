"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dependency_container_1 = require("./dependency-container");
tslib_1.__exportStar(require("./decorators"), exports);
tslib_1.__exportStar(require("./factories"), exports);
tslib_1.__exportStar(require("./providers"), exports);
exports.container = dependency_container_1.instance;
