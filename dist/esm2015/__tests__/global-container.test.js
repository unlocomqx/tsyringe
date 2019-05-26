import * as tslib_1 from "tslib";
import { inject, injectable, registry, singleton } from "../decorators";
import { instanceCachingFactory, predicateAwareClassFactory } from "../factories";
import { instance as globalContainer } from "../dependency-container";
afterEach(() => {
    globalContainer.reset();
});
test("fails to resolve unregistered dependency by name", () => {
    expect(() => {
        globalContainer.resolve("NotRegistered");
    }).toThrow();
});
test("resolves transient instances when not registered", () => {
    class Bar {
    }
    const myBar = globalContainer.resolve(Bar);
    const myBar2 = globalContainer.resolve(Bar);
    expect(myBar instanceof Bar).toBeTruthy();
    expect(myBar2 instanceof Bar).toBeTruthy();
    expect(myBar).not.toBe(myBar2);
});
test("resolves a transient instance when registered by class provider", () => {
    class Bar {
    }
    globalContainer.register("Bar", { useClass: Bar });
    const myBar = globalContainer.resolve("Bar");
    const myBar2 = globalContainer.resolve("Bar");
    expect(myBar instanceof Bar).toBeTruthy();
    expect(myBar2 instanceof Bar).toBeTruthy();
    expect(myBar).not.toBe(myBar2);
});
test("resolves a singleton instance when class provider registered as singleton", () => {
    class Bar {
    }
    globalContainer.register("Bar", { useClass: Bar }, { singleton: true });
    const myBar = globalContainer.resolve("Bar");
    const myBar2 = globalContainer.resolve("Bar");
    expect(myBar instanceof Bar).toBeTruthy();
    expect(myBar).toBe(myBar2);
});
test("resolves a transient instance when using token alias", () => {
    class Bar {
    }
    globalContainer.register("Bar", { useClass: Bar });
    globalContainer.register("BarAlias", { useToken: "Bar" });
    const myBar = globalContainer.resolve("BarAlias");
    const myBar2 = globalContainer.resolve("BarAlias");
    expect(myBar instanceof Bar).toBeTruthy();
    expect(myBar).not.toBe(myBar2);
});
test("resolves a singleton instance when token alias registered as singleton", () => {
    class Bar {
    }
    globalContainer.register("Bar", { useClass: Bar });
    globalContainer.register("SingletonBar", { useToken: "Bar" }, { singleton: true });
    const myBar = globalContainer.resolve("SingletonBar");
    const myBar2 = globalContainer.resolve("SingletonBar");
    expect(myBar instanceof Bar).toBeTruthy();
    expect(myBar).toBe(myBar2);
});
test("resolves same instance when registerInstance() is used with a class", () => {
    class Bar {
    }
    const instance = new Bar();
    globalContainer.registerInstance(Bar, instance);
    expect(globalContainer.resolve(Bar)).toBe(instance);
});
test("resolves same instance when registerInstance() is used with a name", () => {
    class Bar {
    }
    const instance = new Bar();
    globalContainer.registerInstance("Test", instance);
    expect(globalContainer.resolve("Test")).toBe(instance);
});
test("registerType() allows for classes to be swapped", () => {
    class Bar {
    }
    class Foo {
    }
    globalContainer.registerType(Bar, Foo);
    expect(globalContainer.resolve(Bar) instanceof Foo).toBeTruthy();
});
test("registerType() allows for names to be registered for a given type", () => {
    class Bar {
    }
    globalContainer.registerType("CoolName", Bar);
    expect(globalContainer.resolve("CoolName") instanceof Bar).toBeTruthy();
});
test("executes a registered factory each time resolve is called", () => {
    const factoryMock = jest.fn();
    globalContainer.register("Test", { useFactory: factoryMock });
    globalContainer.resolve("Test");
    globalContainer.resolve("Test");
    expect(factoryMock.mock.calls.length).toBe(2);
});
test("resolves to factory result each time resolve is called", () => {
    const factoryMock = jest.fn();
    globalContainer.register("Test", { useFactory: factoryMock });
    const value1 = 1;
    const value2 = 2;
    factoryMock.mockReturnValue(value1);
    const result1 = globalContainer.resolve("Test");
    factoryMock.mockReturnValue(value2);
    const result2 = globalContainer.resolve("Test");
    expect(result1).toBe(value1);
    expect(result2).toBe(value2);
});
test("resolves anonymous classes separately", () => {
    const ctor1 = class {
    };
    const ctor2 = class {
    };
    globalContainer.registerInstance(ctor1, new ctor1());
    globalContainer.registerInstance(ctor2, new ctor2());
    expect(globalContainer.resolve(ctor1) instanceof ctor1).toBeTruthy();
    expect(globalContainer.resolve(ctor2) instanceof ctor2).toBeTruthy();
});
test("returns true for a registered singleton class", () => {
    let Bar = class Bar {
        constructor() {
            this.value = "";
        }
    };
    Bar = tslib_1.__decorate([
        injectable()
    ], Bar);
    let Foo = class Foo {
        constructor(myBar) {
            this.myBar = myBar;
        }
    };
    Foo = tslib_1.__decorate([
        injectable(),
        tslib_1.__metadata("design:paramtypes", [Bar])
    ], Foo);
    globalContainer.registerSingleton(Foo);
    expect(globalContainer.isRegistered(Foo)).toBeTruthy();
});
test("returns true for a registered class provider", () => {
    let Bar = class Bar {
        constructor() {
            this.value = "";
        }
    };
    Bar = tslib_1.__decorate([
        injectable()
    ], Bar);
    let Foo = class Foo {
        constructor(myBar) {
            this.myBar = myBar;
        }
    };
    Foo = tslib_1.__decorate([
        injectable(),
        tslib_1.__metadata("design:paramtypes", [Bar])
    ], Foo);
    globalContainer.register(Foo, { useClass: Foo });
    expect(globalContainer.isRegistered(Foo)).toBeTruthy();
});
test("returns true for a registered value provider", () => {
    let Bar = class Bar {
        constructor() {
            this.value = "";
        }
    };
    Bar = tslib_1.__decorate([
        injectable()
    ], Bar);
    let Foo = class Foo {
        constructor(myBar) {
            this.myBar = myBar;
        }
    };
    Foo = tslib_1.__decorate([
        injectable(),
        tslib_1.__metadata("design:paramtypes", [Bar])
    ], Foo);
    globalContainer.register(Foo, { useValue: {} });
    expect(globalContainer.isRegistered(Foo)).toBeTruthy();
});
test("returns true for a registered token provider", () => {
    let Bar = class Bar {
        constructor() {
            this.value = "";
        }
    };
    Bar = tslib_1.__decorate([
        injectable()
    ], Bar);
    let Foo = class Foo {
        constructor(myBar) {
            this.myBar = myBar;
        }
    };
    Foo = tslib_1.__decorate([
        injectable(),
        tslib_1.__metadata("design:paramtypes", [Bar])
    ], Foo);
    globalContainer.register(Foo, { useToken: "Bar" });
    expect(globalContainer.isRegistered(Foo)).toBeTruthy();
});
test("@injectable resolves when not using DI", () => {
    let Bar = class Bar {
        constructor() {
            this.value = "";
        }
    };
    Bar = tslib_1.__decorate([
        injectable()
    ], Bar);
    let Foo = class Foo {
        constructor(myBar) {
            this.myBar = myBar;
        }
    };
    Foo = tslib_1.__decorate([
        injectable(),
        tslib_1.__metadata("design:paramtypes", [Bar])
    ], Foo);
    const myValue = "test";
    const myBar = new Bar();
    myBar.value = myValue;
    const myFoo = new Foo(myBar);
    expect(myFoo.myBar.value).toBe(myValue);
});
test("@injectable resolves when using DI", () => {
    let Bar = class Bar {
        constructor() {
            this.value = "";
        }
    };
    Bar = tslib_1.__decorate([
        injectable()
    ], Bar);
    let Foo = class Foo {
        constructor(myBar) {
            this.myBar = myBar;
        }
    };
    Foo = tslib_1.__decorate([
        injectable(),
        tslib_1.__metadata("design:paramtypes", [Bar])
    ], Foo);
    const myFoo = globalContainer.resolve(Foo);
    expect(myFoo.myBar.value).toBe("");
});
test("@injectable resolves nested depenencies when using DI", () => {
    let Bar = class Bar {
        constructor() {
            this.value = "";
        }
    };
    Bar = tslib_1.__decorate([
        injectable()
    ], Bar);
    let Foo = class Foo {
        constructor(myBar) {
            this.myBar = myBar;
        }
    };
    Foo = tslib_1.__decorate([
        injectable(),
        tslib_1.__metadata("design:paramtypes", [Bar])
    ], Foo);
    let FooBar = class FooBar {
        constructor(myFoo) {
            this.myFoo = myFoo;
        }
    };
    FooBar = tslib_1.__decorate([
        injectable(),
        tslib_1.__metadata("design:paramtypes", [Foo])
    ], FooBar);
    const myFooBar = globalContainer.resolve(FooBar);
    expect(myFooBar.myFoo.myBar.value).toBe("");
});
test("@injectable preserves static members", () => {
    const value = "foobar";
    let MyStatic = class MyStatic {
        static testFunc() {
            return value;
        }
    };
    MyStatic.testVal = value;
    MyStatic = tslib_1.__decorate([
        injectable()
    ], MyStatic);
    expect(MyStatic.testFunc()).toBe(value);
    expect(MyStatic.testVal).toBe(value);
});
test("@injectable handles optional params", () => {
    let Bar = class Bar {
        constructor() {
            this.value = "";
        }
    };
    Bar = tslib_1.__decorate([
        injectable()
    ], Bar);
    let Foo = class Foo {
        constructor(myBar) {
            this.myBar = myBar;
        }
    };
    Foo = tslib_1.__decorate([
        injectable(),
        tslib_1.__metadata("design:paramtypes", [Bar])
    ], Foo);
    let MyOptional = class MyOptional {
        constructor(myFoo) {
            this.myFoo = myFoo;
        }
    };
    MyOptional = tslib_1.__decorate([
        injectable(),
        tslib_1.__metadata("design:paramtypes", [Foo])
    ], MyOptional);
    const myOptional = globalContainer.resolve(MyOptional);
    expect(myOptional.myFoo instanceof Foo).toBeTruthy();
});
test("@singleton registers class as singleton with the global container", () => {
    let Bar = class Bar {
    };
    Bar = tslib_1.__decorate([
        singleton()
    ], Bar);
    const myBar = globalContainer.resolve(Bar);
    const myBar2 = globalContainer.resolve(Bar);
    expect(myBar instanceof Bar).toBeTruthy();
    expect(myBar).toBe(myBar2);
});
test("dependencies of an @singleton can be resolved", () => {
    class Foo {
    }
    let Bar = class Bar {
        constructor(foo) {
            this.foo = foo;
        }
    };
    Bar = tslib_1.__decorate([
        singleton(),
        tslib_1.__metadata("design:paramtypes", [Foo])
    ], Bar);
    const myBar = globalContainer.resolve(Bar);
    expect(myBar.foo instanceof Foo).toBeTruthy();
});
test("passes through the given params", () => {
    let MyViewModel = class MyViewModel {
        constructor(a, b, c) {
            this.a = a;
            this.b = b;
            this.c = c;
        }
    };
    MyViewModel = tslib_1.__decorate([
        injectable(),
        tslib_1.__metadata("design:paramtypes", [Object, Object, Object])
    ], MyViewModel);
    const a = {};
    const b = {};
    const c = {};
    const instance = new MyViewModel(a, b, c);
    expect(instance.a).toBe(a);
    expect(instance.b).toBe(b);
    expect(instance.c).toBe(c);
});
test("doesn't blow up with empty args", () => {
    let RegisteringFoo = class RegisteringFoo {
    };
    RegisteringFoo = tslib_1.__decorate([
        registry()
    ], RegisteringFoo);
    expect(() => new RegisteringFoo()).not.toThrow();
});
test("registers by type provider", () => {
    let Bar = class Bar {
        constructor() {
            this.value = "";
        }
    };
    Bar = tslib_1.__decorate([
        injectable()
    ], Bar);
    let RegisteringFoo = class RegisteringFoo {
    };
    RegisteringFoo = tslib_1.__decorate([
        registry([{ token: Bar, useClass: Bar }])
    ], RegisteringFoo);
    new RegisteringFoo();
    expect(globalContainer.isRegistered(Bar)).toBeTruthy();
});
test("registers by class provider", () => {
    let Bar = class Bar {
        constructor() {
            this.value = "";
        }
    };
    Bar = tslib_1.__decorate([
        injectable()
    ], Bar);
    const registration = {
        token: "IBar",
        useClass: Bar
    };
    let RegisteringFoo = class RegisteringFoo {
    };
    RegisteringFoo = tslib_1.__decorate([
        registry([registration])
    ], RegisteringFoo);
    new RegisteringFoo();
    expect(globalContainer.isRegistered(registration.token)).toBeTruthy();
});
test("registers by value provider", () => {
    const registration = {
        token: "IBar",
        useValue: {}
    };
    let RegisteringFoo = class RegisteringFoo {
    };
    RegisteringFoo = tslib_1.__decorate([
        registry([registration])
    ], RegisteringFoo);
    new RegisteringFoo();
    expect(globalContainer.isRegistered(registration.token)).toBeTruthy();
});
test("registers by token provider", () => {
    const registration = {
        token: "IBar",
        useToken: "IFoo"
    };
    let RegisteringFoo = class RegisteringFoo {
    };
    RegisteringFoo = tslib_1.__decorate([
        registry([registration])
    ], RegisteringFoo);
    new RegisteringFoo();
    expect(globalContainer.isRegistered(registration.token)).toBeTruthy();
});
test("registers by factory provider", () => {
    const registration = {
        token: "IBar",
        useFactory: (globalContainer) => globalContainer.resolve(Bar)
    };
    let Bar = class Bar {
        constructor() {
            this.value = "";
        }
    };
    Bar = tslib_1.__decorate([
        injectable()
    ], Bar);
    let RegisteringFoo = class RegisteringFoo {
    };
    RegisteringFoo = tslib_1.__decorate([
        registry([registration])
    ], RegisteringFoo);
    new RegisteringFoo();
    expect(globalContainer.isRegistered(registration.token)).toBeTruthy();
});
test("registers mixed types", () => {
    let Bar = class Bar {
        constructor() {
            this.value = "";
        }
    };
    Bar = tslib_1.__decorate([
        injectable()
    ], Bar);
    let Foo = class Foo {
        constructor(myBar) {
            this.myBar = myBar;
        }
    };
    Foo = tslib_1.__decorate([
        injectable(),
        tslib_1.__metadata("design:paramtypes", [Bar])
    ], Foo);
    const registration = {
        token: "IBar",
        useClass: Bar
    };
    let RegisteringFoo = class RegisteringFoo {
    };
    RegisteringFoo = tslib_1.__decorate([
        registry([registration, { token: Foo, useClass: Foo }])
    ], RegisteringFoo);
    new RegisteringFoo();
    expect(globalContainer.isRegistered(registration.token)).toBeTruthy();
    expect(globalContainer.isRegistered(Foo)).toBeTruthy();
});
test("registers by symbol token provider", () => {
    const registration = {
        token: Symbol("obj1"),
        useValue: {}
    };
    let RegisteringFoo = class RegisteringFoo {
    };
    RegisteringFoo = tslib_1.__decorate([
        registry([registration])
    ], RegisteringFoo);
    new RegisteringFoo();
    expect(globalContainer.isRegistered(registration.token)).toBeTruthy();
    expect(globalContainer.resolve(registration.token)).toEqual(registration.useValue);
});
test("allows interfaces to be resolved from the constructor with injection token", () => {
    let Bar = class Bar {
        constructor() {
            this.value = "";
        }
    };
    Bar = tslib_1.__decorate([
        injectable()
    ], Bar);
    let FooWithInterface = class FooWithInterface {
        constructor(myBar) {
            this.myBar = myBar;
        }
    };
    FooWithInterface = tslib_1.__decorate([
        injectable(),
        registry([{ token: Bar, useClass: Bar }]),
        tslib_1.__param(0, inject(Bar)),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], FooWithInterface);
    const myFoo = globalContainer.resolve(FooWithInterface);
    expect(myFoo.myBar instanceof Bar).toBeTruthy();
});
test("allows interfaces to be resolved from the constructor with just a name", () => {
    let Bar = class Bar {
        constructor() {
            this.value = "";
        }
    };
    Bar = tslib_1.__decorate([
        injectable()
    ], Bar);
    let FooWithInterface = class FooWithInterface {
        constructor(myBar) {
            this.myBar = myBar;
        }
    };
    FooWithInterface = tslib_1.__decorate([
        injectable(),
        registry([{
                token: "IBar",
                useClass: Bar
            }]),
        tslib_1.__param(0, inject("IBar")),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], FooWithInterface);
    const myFoo = globalContainer.resolve(FooWithInterface);
    expect(myFoo.myBar instanceof Bar).toBeTruthy();
});
test("instanceCachingFactory caches the returned instance", () => {
    const factory = instanceCachingFactory(() => { });
    expect(factory(globalContainer)).toBe(factory(globalContainer));
});
test("instanceCachingFactory caches the returned instance even when there is branching logic in the factory", () => {
    const instanceA = {};
    const instanceB = {};
    let useA = true;
    const factory = instanceCachingFactory(() => useA ? instanceA : instanceB);
    expect(factory(globalContainer)).toBe(instanceA);
    useA = false;
    expect(factory(globalContainer)).toBe(instanceA);
});
test("predicateAwareClassFactory correctly switches the returned instance with caching on", () => {
    class A {
    }
    class B {
    }
    let useA = true;
    const factory = predicateAwareClassFactory(() => useA, A, B);
    expect(factory(globalContainer) instanceof A).toBeTruthy();
    useA = false;
    expect(factory(globalContainer) instanceof B).toBeTruthy();
});
test("predicateAwareClassFactory returns the same instance each call with caching on", () => {
    class A {
    }
    class B {
    }
    const factory = predicateAwareClassFactory(() => true, A, B);
    expect(factory(globalContainer)).toBe(factory(globalContainer));
});
test("predicateAwareClassFactory correctly switches the returned instance with caching off", () => {
    class A {
    }
    class B {
    }
    let useA = true;
    const factory = predicateAwareClassFactory(() => useA, A, B, false);
    expect(factory(globalContainer) instanceof A).toBeTruthy();
    useA = false;
    expect(factory(globalContainer) instanceof B).toBeTruthy();
});
test("predicateAwareClassFactory returns new instances each call with caching off", () => {
    class A {
    }
    class B {
    }
    const factory = predicateAwareClassFactory(() => true, A, B, false);
    expect(factory(globalContainer)).not.toBe(factory(globalContainer));
});
