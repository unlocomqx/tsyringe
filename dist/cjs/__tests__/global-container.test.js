"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const decorators_1 = require("../decorators");
const factories_1 = require("../factories");
const dependency_container_1 = require("../dependency-container");
afterEach(() => {
    dependency_container_1.instance.reset();
});
test("fails to resolve unregistered dependency by name", () => {
    expect(() => {
        dependency_container_1.instance.resolve("NotRegistered");
    }).toThrow();
});
test("resolves transient instances when not registered", () => {
    class Bar {
    }
    const myBar = dependency_container_1.instance.resolve(Bar);
    const myBar2 = dependency_container_1.instance.resolve(Bar);
    expect(myBar instanceof Bar).toBeTruthy();
    expect(myBar2 instanceof Bar).toBeTruthy();
    expect(myBar).not.toBe(myBar2);
});
test("resolves a transient instance when registered by class provider", () => {
    class Bar {
    }
    dependency_container_1.instance.register("Bar", { useClass: Bar });
    const myBar = dependency_container_1.instance.resolve("Bar");
    const myBar2 = dependency_container_1.instance.resolve("Bar");
    expect(myBar instanceof Bar).toBeTruthy();
    expect(myBar2 instanceof Bar).toBeTruthy();
    expect(myBar).not.toBe(myBar2);
});
test("resolves a singleton instance when class provider registered as singleton", () => {
    class Bar {
    }
    dependency_container_1.instance.register("Bar", { useClass: Bar }, { singleton: true });
    const myBar = dependency_container_1.instance.resolve("Bar");
    const myBar2 = dependency_container_1.instance.resolve("Bar");
    expect(myBar instanceof Bar).toBeTruthy();
    expect(myBar).toBe(myBar2);
});
test("resolves a transient instance when using token alias", () => {
    class Bar {
    }
    dependency_container_1.instance.register("Bar", { useClass: Bar });
    dependency_container_1.instance.register("BarAlias", { useToken: "Bar" });
    const myBar = dependency_container_1.instance.resolve("BarAlias");
    const myBar2 = dependency_container_1.instance.resolve("BarAlias");
    expect(myBar instanceof Bar).toBeTruthy();
    expect(myBar).not.toBe(myBar2);
});
test("resolves a singleton instance when token alias registered as singleton", () => {
    class Bar {
    }
    dependency_container_1.instance.register("Bar", { useClass: Bar });
    dependency_container_1.instance.register("SingletonBar", { useToken: "Bar" }, { singleton: true });
    const myBar = dependency_container_1.instance.resolve("SingletonBar");
    const myBar2 = dependency_container_1.instance.resolve("SingletonBar");
    expect(myBar instanceof Bar).toBeTruthy();
    expect(myBar).toBe(myBar2);
});
test("resolves same instance when registerInstance() is used with a class", () => {
    class Bar {
    }
    const instance = new Bar();
    dependency_container_1.instance.registerInstance(Bar, instance);
    expect(dependency_container_1.instance.resolve(Bar)).toBe(instance);
});
test("resolves same instance when registerInstance() is used with a name", () => {
    class Bar {
    }
    const instance = new Bar();
    dependency_container_1.instance.registerInstance("Test", instance);
    expect(dependency_container_1.instance.resolve("Test")).toBe(instance);
});
test("registerType() allows for classes to be swapped", () => {
    class Bar {
    }
    class Foo {
    }
    dependency_container_1.instance.registerType(Bar, Foo);
    expect(dependency_container_1.instance.resolve(Bar) instanceof Foo).toBeTruthy();
});
test("registerType() allows for names to be registered for a given type", () => {
    class Bar {
    }
    dependency_container_1.instance.registerType("CoolName", Bar);
    expect(dependency_container_1.instance.resolve("CoolName") instanceof Bar).toBeTruthy();
});
test("executes a registered factory each time resolve is called", () => {
    const factoryMock = jest.fn();
    dependency_container_1.instance.register("Test", { useFactory: factoryMock });
    dependency_container_1.instance.resolve("Test");
    dependency_container_1.instance.resolve("Test");
    expect(factoryMock.mock.calls.length).toBe(2);
});
test("resolves to factory result each time resolve is called", () => {
    const factoryMock = jest.fn();
    dependency_container_1.instance.register("Test", { useFactory: factoryMock });
    const value1 = 1;
    const value2 = 2;
    factoryMock.mockReturnValue(value1);
    const result1 = dependency_container_1.instance.resolve("Test");
    factoryMock.mockReturnValue(value2);
    const result2 = dependency_container_1.instance.resolve("Test");
    expect(result1).toBe(value1);
    expect(result2).toBe(value2);
});
test("resolves anonymous classes separately", () => {
    const ctor1 = class {
    };
    const ctor2 = class {
    };
    dependency_container_1.instance.registerInstance(ctor1, new ctor1());
    dependency_container_1.instance.registerInstance(ctor2, new ctor2());
    expect(dependency_container_1.instance.resolve(ctor1) instanceof ctor1).toBeTruthy();
    expect(dependency_container_1.instance.resolve(ctor2) instanceof ctor2).toBeTruthy();
});
test("returns true for a registered singleton class", () => {
    let Bar = class Bar {
        constructor() {
            this.value = "";
        }
    };
    Bar = tslib_1.__decorate([
        decorators_1.injectable()
    ], Bar);
    let Foo = class Foo {
        constructor(myBar) {
            this.myBar = myBar;
        }
    };
    Foo = tslib_1.__decorate([
        decorators_1.injectable(),
        tslib_1.__metadata("design:paramtypes", [Bar])
    ], Foo);
    dependency_container_1.instance.registerSingleton(Foo);
    expect(dependency_container_1.instance.isRegistered(Foo)).toBeTruthy();
});
test("returns true for a registered class provider", () => {
    let Bar = class Bar {
        constructor() {
            this.value = "";
        }
    };
    Bar = tslib_1.__decorate([
        decorators_1.injectable()
    ], Bar);
    let Foo = class Foo {
        constructor(myBar) {
            this.myBar = myBar;
        }
    };
    Foo = tslib_1.__decorate([
        decorators_1.injectable(),
        tslib_1.__metadata("design:paramtypes", [Bar])
    ], Foo);
    dependency_container_1.instance.register(Foo, { useClass: Foo });
    expect(dependency_container_1.instance.isRegistered(Foo)).toBeTruthy();
});
test("returns true for a registered value provider", () => {
    let Bar = class Bar {
        constructor() {
            this.value = "";
        }
    };
    Bar = tslib_1.__decorate([
        decorators_1.injectable()
    ], Bar);
    let Foo = class Foo {
        constructor(myBar) {
            this.myBar = myBar;
        }
    };
    Foo = tslib_1.__decorate([
        decorators_1.injectable(),
        tslib_1.__metadata("design:paramtypes", [Bar])
    ], Foo);
    dependency_container_1.instance.register(Foo, { useValue: {} });
    expect(dependency_container_1.instance.isRegistered(Foo)).toBeTruthy();
});
test("returns true for a registered token provider", () => {
    let Bar = class Bar {
        constructor() {
            this.value = "";
        }
    };
    Bar = tslib_1.__decorate([
        decorators_1.injectable()
    ], Bar);
    let Foo = class Foo {
        constructor(myBar) {
            this.myBar = myBar;
        }
    };
    Foo = tslib_1.__decorate([
        decorators_1.injectable(),
        tslib_1.__metadata("design:paramtypes", [Bar])
    ], Foo);
    dependency_container_1.instance.register(Foo, { useToken: "Bar" });
    expect(dependency_container_1.instance.isRegistered(Foo)).toBeTruthy();
});
test("@injectable resolves when not using DI", () => {
    let Bar = class Bar {
        constructor() {
            this.value = "";
        }
    };
    Bar = tslib_1.__decorate([
        decorators_1.injectable()
    ], Bar);
    let Foo = class Foo {
        constructor(myBar) {
            this.myBar = myBar;
        }
    };
    Foo = tslib_1.__decorate([
        decorators_1.injectable(),
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
        decorators_1.injectable()
    ], Bar);
    let Foo = class Foo {
        constructor(myBar) {
            this.myBar = myBar;
        }
    };
    Foo = tslib_1.__decorate([
        decorators_1.injectable(),
        tslib_1.__metadata("design:paramtypes", [Bar])
    ], Foo);
    const myFoo = dependency_container_1.instance.resolve(Foo);
    expect(myFoo.myBar.value).toBe("");
});
test("@injectable resolves nested depenencies when using DI", () => {
    let Bar = class Bar {
        constructor() {
            this.value = "";
        }
    };
    Bar = tslib_1.__decorate([
        decorators_1.injectable()
    ], Bar);
    let Foo = class Foo {
        constructor(myBar) {
            this.myBar = myBar;
        }
    };
    Foo = tslib_1.__decorate([
        decorators_1.injectable(),
        tslib_1.__metadata("design:paramtypes", [Bar])
    ], Foo);
    let FooBar = class FooBar {
        constructor(myFoo) {
            this.myFoo = myFoo;
        }
    };
    FooBar = tslib_1.__decorate([
        decorators_1.injectable(),
        tslib_1.__metadata("design:paramtypes", [Foo])
    ], FooBar);
    const myFooBar = dependency_container_1.instance.resolve(FooBar);
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
        decorators_1.injectable()
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
        decorators_1.injectable()
    ], Bar);
    let Foo = class Foo {
        constructor(myBar) {
            this.myBar = myBar;
        }
    };
    Foo = tslib_1.__decorate([
        decorators_1.injectable(),
        tslib_1.__metadata("design:paramtypes", [Bar])
    ], Foo);
    let MyOptional = class MyOptional {
        constructor(myFoo) {
            this.myFoo = myFoo;
        }
    };
    MyOptional = tslib_1.__decorate([
        decorators_1.injectable(),
        tslib_1.__metadata("design:paramtypes", [Foo])
    ], MyOptional);
    const myOptional = dependency_container_1.instance.resolve(MyOptional);
    expect(myOptional.myFoo instanceof Foo).toBeTruthy();
});
test("@singleton registers class as singleton with the global container", () => {
    let Bar = class Bar {
    };
    Bar = tslib_1.__decorate([
        decorators_1.singleton()
    ], Bar);
    const myBar = dependency_container_1.instance.resolve(Bar);
    const myBar2 = dependency_container_1.instance.resolve(Bar);
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
        decorators_1.singleton(),
        tslib_1.__metadata("design:paramtypes", [Foo])
    ], Bar);
    const myBar = dependency_container_1.instance.resolve(Bar);
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
        decorators_1.injectable(),
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
        decorators_1.registry()
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
        decorators_1.injectable()
    ], Bar);
    let RegisteringFoo = class RegisteringFoo {
    };
    RegisteringFoo = tslib_1.__decorate([
        decorators_1.registry([{ token: Bar, useClass: Bar }])
    ], RegisteringFoo);
    new RegisteringFoo();
    expect(dependency_container_1.instance.isRegistered(Bar)).toBeTruthy();
});
test("registers by class provider", () => {
    let Bar = class Bar {
        constructor() {
            this.value = "";
        }
    };
    Bar = tslib_1.__decorate([
        decorators_1.injectable()
    ], Bar);
    const registration = {
        token: "IBar",
        useClass: Bar
    };
    let RegisteringFoo = class RegisteringFoo {
    };
    RegisteringFoo = tslib_1.__decorate([
        decorators_1.registry([registration])
    ], RegisteringFoo);
    new RegisteringFoo();
    expect(dependency_container_1.instance.isRegistered(registration.token)).toBeTruthy();
});
test("registers by value provider", () => {
    const registration = {
        token: "IBar",
        useValue: {}
    };
    let RegisteringFoo = class RegisteringFoo {
    };
    RegisteringFoo = tslib_1.__decorate([
        decorators_1.registry([registration])
    ], RegisteringFoo);
    new RegisteringFoo();
    expect(dependency_container_1.instance.isRegistered(registration.token)).toBeTruthy();
});
test("registers by token provider", () => {
    const registration = {
        token: "IBar",
        useToken: "IFoo"
    };
    let RegisteringFoo = class RegisteringFoo {
    };
    RegisteringFoo = tslib_1.__decorate([
        decorators_1.registry([registration])
    ], RegisteringFoo);
    new RegisteringFoo();
    expect(dependency_container_1.instance.isRegistered(registration.token)).toBeTruthy();
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
        decorators_1.injectable()
    ], Bar);
    let RegisteringFoo = class RegisteringFoo {
    };
    RegisteringFoo = tslib_1.__decorate([
        decorators_1.registry([registration])
    ], RegisteringFoo);
    new RegisteringFoo();
    expect(dependency_container_1.instance.isRegistered(registration.token)).toBeTruthy();
});
test("registers mixed types", () => {
    let Bar = class Bar {
        constructor() {
            this.value = "";
        }
    };
    Bar = tslib_1.__decorate([
        decorators_1.injectable()
    ], Bar);
    let Foo = class Foo {
        constructor(myBar) {
            this.myBar = myBar;
        }
    };
    Foo = tslib_1.__decorate([
        decorators_1.injectable(),
        tslib_1.__metadata("design:paramtypes", [Bar])
    ], Foo);
    const registration = {
        token: "IBar",
        useClass: Bar
    };
    let RegisteringFoo = class RegisteringFoo {
    };
    RegisteringFoo = tslib_1.__decorate([
        decorators_1.registry([registration, { token: Foo, useClass: Foo }])
    ], RegisteringFoo);
    new RegisteringFoo();
    expect(dependency_container_1.instance.isRegistered(registration.token)).toBeTruthy();
    expect(dependency_container_1.instance.isRegistered(Foo)).toBeTruthy();
});
test("registers by symbol token provider", () => {
    const registration = {
        token: Symbol("obj1"),
        useValue: {}
    };
    let RegisteringFoo = class RegisteringFoo {
    };
    RegisteringFoo = tslib_1.__decorate([
        decorators_1.registry([registration])
    ], RegisteringFoo);
    new RegisteringFoo();
    expect(dependency_container_1.instance.isRegistered(registration.token)).toBeTruthy();
    expect(dependency_container_1.instance.resolve(registration.token)).toEqual(registration.useValue);
});
test("allows interfaces to be resolved from the constructor with injection token", () => {
    let Bar = class Bar {
        constructor() {
            this.value = "";
        }
    };
    Bar = tslib_1.__decorate([
        decorators_1.injectable()
    ], Bar);
    let FooWithInterface = class FooWithInterface {
        constructor(myBar) {
            this.myBar = myBar;
        }
    };
    FooWithInterface = tslib_1.__decorate([
        decorators_1.injectable(),
        decorators_1.registry([{ token: Bar, useClass: Bar }]),
        tslib_1.__param(0, decorators_1.inject(Bar)),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], FooWithInterface);
    const myFoo = dependency_container_1.instance.resolve(FooWithInterface);
    expect(myFoo.myBar instanceof Bar).toBeTruthy();
});
test("allows interfaces to be resolved from the constructor with just a name", () => {
    let Bar = class Bar {
        constructor() {
            this.value = "";
        }
    };
    Bar = tslib_1.__decorate([
        decorators_1.injectable()
    ], Bar);
    let FooWithInterface = class FooWithInterface {
        constructor(myBar) {
            this.myBar = myBar;
        }
    };
    FooWithInterface = tslib_1.__decorate([
        decorators_1.injectable(),
        decorators_1.registry([{
                token: "IBar",
                useClass: Bar
            }]),
        tslib_1.__param(0, decorators_1.inject("IBar")),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], FooWithInterface);
    const myFoo = dependency_container_1.instance.resolve(FooWithInterface);
    expect(myFoo.myBar instanceof Bar).toBeTruthy();
});
test("instanceCachingFactory caches the returned instance", () => {
    const factory = factories_1.instanceCachingFactory(() => { });
    expect(factory(dependency_container_1.instance)).toBe(factory(dependency_container_1.instance));
});
test("instanceCachingFactory caches the returned instance even when there is branching logic in the factory", () => {
    const instanceA = {};
    const instanceB = {};
    let useA = true;
    const factory = factories_1.instanceCachingFactory(() => useA ? instanceA : instanceB);
    expect(factory(dependency_container_1.instance)).toBe(instanceA);
    useA = false;
    expect(factory(dependency_container_1.instance)).toBe(instanceA);
});
test("predicateAwareClassFactory correctly switches the returned instance with caching on", () => {
    class A {
    }
    class B {
    }
    let useA = true;
    const factory = factories_1.predicateAwareClassFactory(() => useA, A, B);
    expect(factory(dependency_container_1.instance) instanceof A).toBeTruthy();
    useA = false;
    expect(factory(dependency_container_1.instance) instanceof B).toBeTruthy();
});
test("predicateAwareClassFactory returns the same instance each call with caching on", () => {
    class A {
    }
    class B {
    }
    const factory = factories_1.predicateAwareClassFactory(() => true, A, B);
    expect(factory(dependency_container_1.instance)).toBe(factory(dependency_container_1.instance));
});
test("predicateAwareClassFactory correctly switches the returned instance with caching off", () => {
    class A {
    }
    class B {
    }
    let useA = true;
    const factory = factories_1.predicateAwareClassFactory(() => useA, A, B, false);
    expect(factory(dependency_container_1.instance) instanceof A).toBeTruthy();
    useA = false;
    expect(factory(dependency_container_1.instance) instanceof B).toBeTruthy();
});
test("predicateAwareClassFactory returns new instances each call with caching off", () => {
    class A {
    }
    class B {
    }
    const factory = factories_1.predicateAwareClassFactory(() => true, A, B, false);
    expect(factory(dependency_container_1.instance)).not.toBe(factory(dependency_container_1.instance));
});
