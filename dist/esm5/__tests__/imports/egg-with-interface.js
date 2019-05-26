import * as tslib_1 from "tslib";
import { injectable, lazyInject, registry } from "../../decorators";
var EggWithInterface = (function () {
    function EggWithInterface() {
    }
    tslib_1.__decorate([
        lazyInject("IChicken"),
        tslib_1.__metadata("design:type", Object)
    ], EggWithInterface.prototype, "chicken", void 0);
    EggWithInterface = tslib_1.__decorate([
        injectable(),
        registry([{
                token: "IChicken",
                useToken: "ChickenWithInterface"
            }]),
        tslib_1.__metadata("design:paramtypes", [])
    ], EggWithInterface);
    return EggWithInterface;
}());
export { EggWithInterface };
