"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dependency_container_1 = require("../dependency-container");
test("child container resolves even when parent doesn't have registration", () => {
    class Foo {
    }
    const container = dependency_container_1.instance.createChildContainer();
    container.register("IFoo", { useClass: Foo });
    const myFoo = container.resolve("IFoo");
    expect(myFoo instanceof Foo).toBeTruthy();
});
test("child container resolves using parents' registration when child container doesn't have registration", () => {
    class Foo {
    }
    dependency_container_1.instance.register("IFoo", { useClass: Foo });
    const container = dependency_container_1.instance.createChildContainer();
    const myFoo = container.resolve("IFoo");
    expect(myFoo instanceof Foo).toBeTruthy();
});
