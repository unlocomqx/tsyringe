"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chicken_1 = require("./imports/chicken");
const egg_1 = require("./imports/egg");
const dependency_container_1 = require("../dependency-container");
test("works with circular dependency", () => {
    const chicken = dependency_container_1.instance.resolve(chicken_1.Chicken);
    const egg = dependency_container_1.instance.resolve(egg_1.Egg);
    expect(chicken.egg instanceof egg_1.Egg).toBeTruthy();
    expect(egg.chicken instanceof chicken_1.Chicken).toBeTruthy();
});
