import { Chicken } from "./imports/chicken";
import { ChickenWithInterface } from "./imports/chicken-with-interface";
import { Egg } from "./imports/egg";
import { EggWithInterface } from "./imports/egg-with-interface";
import { instance as globalContainer } from "../dependency-container";
test("works with circular dependency", () => {
    const chicken = globalContainer.resolve(Chicken);
    const egg = globalContainer.resolve(Egg);
    expect(chicken.egg instanceof Egg).toBeTruthy();
    expect(egg.chicken instanceof Chicken).toBeTruthy();
});
test("works with circular dependency using interfaces", () => {
    const chicken = globalContainer.resolve(ChickenWithInterface);
    const egg = globalContainer.resolve(EggWithInterface);
    expect(chicken.egg instanceof EggWithInterface).toBeTruthy();
    expect(egg.chicken instanceof ChickenWithInterface).toBeTruthy();
});
