"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const decorators_1 = require("../../decorators");
const chicken_1 = require("./chicken");
let Egg = class Egg {
    constructor() {
    }
};
tslib_1.__decorate([
    decorators_1.lazyInject("Chicken"),
    tslib_1.__metadata("design:type", chicken_1.Chicken)
], Egg.prototype, "chicken", void 0);
Egg = tslib_1.__decorate([
    decorators_1.injectable(),
    tslib_1.__metadata("design:paramtypes", [])
], Egg);
exports.Egg = Egg;
