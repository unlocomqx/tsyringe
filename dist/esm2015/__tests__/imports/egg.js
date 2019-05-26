import * as tslib_1 from "tslib";
import { injectable, lazyInject } from "../../decorators";
import { Chicken } from "./chicken";
let Egg = class Egg {
    constructor() {
    }
};
tslib_1.__decorate([
    lazyInject("Chicken"),
    tslib_1.__metadata("design:type", Chicken)
], Egg.prototype, "chicken", void 0);
Egg = tslib_1.__decorate([
    injectable(),
    tslib_1.__metadata("design:paramtypes", [])
], Egg);
export { Egg };
