import * as tslib_1 from "tslib";
import { injectable, lazyInject, registry } from "../../decorators";
let ChickenWithInterface = class ChickenWithInterface {
    constructor() {
    }
};
tslib_1.__decorate([
    lazyInject("IEgg"),
    tslib_1.__metadata("design:type", Object)
], ChickenWithInterface.prototype, "egg", void 0);
ChickenWithInterface = tslib_1.__decorate([
    injectable(),
    registry([{
            token: "IEgg",
            useToken: "EggWithInterface"
        }]),
    tslib_1.__metadata("design:paramtypes", [])
], ChickenWithInterface);
export { ChickenWithInterface };
