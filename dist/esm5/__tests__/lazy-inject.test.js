import { Chicken } from "./imports/chicken";
import { Egg } from "./imports/egg";
import { instance as globalContainer } from "../dependency-container";
test("works with circular dependency", function () {
    var chicken = globalContainer.resolve(Chicken);
    var egg = globalContainer.resolve(Egg);
    expect(chicken.egg instanceof Egg).toBeTruthy();
    expect(egg.chicken instanceof Chicken).toBeTruthy();
});
