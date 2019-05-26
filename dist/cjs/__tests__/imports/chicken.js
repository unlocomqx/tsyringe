"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const decorators_1 = require("../../decorators");
const egg_1 = require("./egg");
let Chicken = class Chicken {
    constructor() { }
};
tslib_1.__decorate([
    decorators_1.lazyInject("Egg"),
    tslib_1.__metadata("design:type", egg_1.Egg)
], Chicken.prototype, "egg", void 0);
Chicken = tslib_1.__decorate([
    decorators_1.injectable(),
    tslib_1.__metadata("design:paramtypes", [])
], Chicken);
exports.Chicken = Chicken;
