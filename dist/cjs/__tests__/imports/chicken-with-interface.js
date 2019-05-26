"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const decorators_1 = require("../../decorators");
let ChickenWithInterface = class ChickenWithInterface {
    constructor() {
    }
};
tslib_1.__decorate([
    decorators_1.lazyInject("IEgg"),
    tslib_1.__metadata("design:type", Object)
], ChickenWithInterface.prototype, "egg", void 0);
ChickenWithInterface = tslib_1.__decorate([
    decorators_1.injectable(),
    decorators_1.registry([{
            token: "IEgg",
            useToken: "EggWithInterface"
        }]),
    tslib_1.__metadata("design:paramtypes", [])
], ChickenWithInterface);
exports.ChickenWithInterface = ChickenWithInterface;
