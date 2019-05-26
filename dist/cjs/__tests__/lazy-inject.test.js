"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chicken_1 = require("./imports/chicken");
const chicken_with_interface_1 = require("./imports/chicken-with-interface");
const egg_1 = require("./imports/egg");
const egg_with_interface_1 = require("./imports/egg-with-interface");
const dependency_container_1 = require("../dependency-container");
test("works with circular dependency", () => {
    const chicken = dependency_container_1.instance.resolve(chicken_1.Chicken);
    const egg = dependency_container_1.instance.resolve(egg_1.Egg);
    expect(chicken.egg instanceof egg_1.Egg).toBeTruthy();
    expect(egg.chicken instanceof chicken_1.Chicken).toBeTruthy();
});
test("works with circular dependency using interfaces", () => {
    const chicken = dependency_container_1.instance.resolve(chicken_with_interface_1.ChickenWithInterface);
    const egg = dependency_container_1.instance.resolve(egg_with_interface_1.EggWithInterface);
    expect(chicken.egg instanceof egg_with_interface_1.EggWithInterface).toBeTruthy();
    expect(egg.chicken instanceof chicken_with_interface_1.ChickenWithInterface).toBeTruthy();
});
