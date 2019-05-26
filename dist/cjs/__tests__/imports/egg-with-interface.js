"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const decorators_1 = require("../../decorators");
let EggWithInterface = class EggWithInterface {
    constructor() {
    }
};
tslib_1.__decorate([
    decorators_1.lazyInject("IChicken"),
    tslib_1.__metadata("design:type", Object)
], EggWithInterface.prototype, "chicken", void 0);
EggWithInterface = tslib_1.__decorate([
    decorators_1.injectable(),
    decorators_1.registry([{
            token: "IChicken",
            useToken: "ChickenWithInterface"
        }]),
    tslib_1.__metadata("design:paramtypes", [])
], EggWithInterface);
exports.EggWithInterface = EggWithInterface;
