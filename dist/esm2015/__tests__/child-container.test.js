import { instance as globalContainer } from "../dependency-container";
test("child container resolves even when parent doesn't have registration", () => {
    class Foo {
    }
    const container = globalContainer.createChildContainer();
    container.register("IFoo", { useClass: Foo });
    const myFoo = container.resolve("IFoo");
    expect(myFoo instanceof Foo).toBeTruthy();
});
test("child container resolves using parents' registration when child container doesn't have registration", () => {
    class Foo {
    }
    globalContainer.register("IFoo", { useClass: Foo });
    const container = globalContainer.createChildContainer();
    const myFoo = container.resolve("IFoo");
    expect(myFoo instanceof Foo).toBeTruthy();
});
