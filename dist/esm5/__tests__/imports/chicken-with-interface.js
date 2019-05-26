import * as tslib_1 from "tslib";
import { injectable, lazyInject, registry } from "../../decorators";
var ChickenWithInterface = (function () {
    function ChickenWithInterface() {
    }
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
    return ChickenWithInterface;
}());
export { ChickenWithInterface };
