import * as tslib_1 from "tslib";
import { injectable, lazyInject } from "../../decorators";
import { Egg } from "./egg";
let Chicken = class Chicken {
    constructor() { }
};
tslib_1.__decorate([
    lazyInject("Egg"),
    tslib_1.__metadata("design:type", Egg)
], Chicken.prototype, "egg", void 0);
Chicken = tslib_1.__decorate([
    injectable(),
    tslib_1.__metadata("design:paramtypes", [])
], Chicken);
export { Chicken };
