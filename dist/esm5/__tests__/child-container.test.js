import { instance as globalContainer } from "../dependency-container";
test("child container resolves even when parent doesn't have registration", function () {
    var Foo = (function () {
        function Foo() {
        }
        return Foo;
    }());
    var container = globalContainer.createChildContainer();
    container.register("IFoo", { useClass: Foo });
    var myFoo = container.resolve("IFoo");
    expect(myFoo instanceof Foo).toBeTruthy();
});
test("child container resolves using parents' registration when child container doesn't have registration", function () {
    var Foo = (function () {
        function Foo() {
        }
        return Foo;
    }());
    globalContainer.register("IFoo", { useClass: Foo });
    var container = globalContainer.createChildContainer();
    var myFoo = container.resolve("IFoo");
    expect(myFoo instanceof Foo).toBeTruthy();
});
