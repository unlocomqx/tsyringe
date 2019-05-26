import * as tslib_1 from "tslib";
import { inject, injectable, registry, singleton } from "../decorators";
import { instanceCachingFactory, predicateAwareClassFactory } from "../factories";
import { instance as globalContainer } from "../dependency-container";
afterEach(function () {
    globalContainer.reset();
});
test("fails to resolve unregistered dependency by name", function () {
    expect(function () {
        globalContainer.resolve("NotRegistered");
    }).toThrow();
});
test("resolves transient instances when not registered", function () {
    var Bar = (function () {
        function Bar() {
        }
        return Bar;
    }());
    var myBar = globalContainer.resolve(Bar);
    var myBar2 = globalContainer.resolve(Bar);
    expect(myBar instanceof Bar).toBeTruthy();
    expect(myBar2 instanceof Bar).toBeTruthy();
    expect(myBar).not.toBe(myBar2);
});
test("resolves a transient instance when registered by class provider", function () {
    var Bar = (function () {
        function Bar() {
        }
        return Bar;
    }());
    globalContainer.register("Bar", { useClass: Bar });
    var myBar = globalContainer.resolve("Bar");
    var myBar2 = globalContainer.resolve("Bar");
    expect(myBar instanceof Bar).toBeTruthy();
    expect(myBar2 instanceof Bar).toBeTruthy();
    expect(myBar).not.toBe(myBar2);
});
test("resolves a singleton instance when class provider registered as singleton", function () {
    var Bar = (function () {
        function Bar() {
        }
        return Bar;
    }());
    globalContainer.register("Bar", { useClass: Bar }, { singleton: true });
    var myBar = globalContainer.resolve("Bar");
    var myBar2 = globalContainer.resolve("Bar");
    expect(myBar instanceof Bar).toBeTruthy();
    expect(myBar).toBe(myBar2);
});
test("resolves a transient instance when using token alias", function () {
    var Bar = (function () {
        function Bar() {
        }
        return Bar;
    }());
    globalContainer.register("Bar", { useClass: Bar });
    globalContainer.register("BarAlias", { useToken: "Bar" });
    var myBar = globalContainer.resolve("BarAlias");
    var myBar2 = globalContainer.resolve("BarAlias");
    expect(myBar instanceof Bar).toBeTruthy();
    expect(myBar).not.toBe(myBar2);
});
test("resolves a singleton instance when token alias registered as singleton", function () {
    var Bar = (function () {
        function Bar() {
        }
        return Bar;
    }());
    globalContainer.register("Bar", { useClass: Bar });
    globalContainer.register("SingletonBar", { useToken: "Bar" }, { singleton: true });
    var myBar = globalContainer.resolve("SingletonBar");
    var myBar2 = globalContainer.resolve("SingletonBar");
    expect(myBar instanceof Bar).toBeTruthy();
    expect(myBar).toBe(myBar2);
});
test("resolves same instance when registerInstance() is used with a class", function () {
    var Bar = (function () {
        function Bar() {
        }
        return Bar;
    }());
    var instance = new Bar();
    globalContainer.registerInstance(Bar, instance);
    expect(globalContainer.resolve(Bar)).toBe(instance);
});
test("resolves same instance when registerInstance() is used with a name", function () {
    var Bar = (function () {
        function Bar() {
        }
        return Bar;
    }());
    var instance = new Bar();
    globalContainer.registerInstance("Test", instance);
    expect(globalContainer.resolve("Test")).toBe(instance);
});
test("registerType() allows for classes to be swapped", function () {
    var Bar = (function () {
        function Bar() {
        }
        return Bar;
    }());
    var Foo = (function () {
        function Foo() {
        }
        return Foo;
    }());
    globalContainer.registerType(Bar, Foo);
    expect(globalContainer.resolve(Bar) instanceof Foo).toBeTruthy();
});
test("registerType() allows for names to be registered for a given type", function () {
    var Bar = (function () {
        function Bar() {
        }
        return Bar;
    }());
    globalContainer.registerType("CoolName", Bar);
    expect(globalContainer.resolve("CoolName") instanceof Bar).toBeTruthy();
});
test("executes a registered factory each time resolve is called", function () {
    var factoryMock = jest.fn();
    globalContainer.register("Test", { useFactory: factoryMock });
    globalContainer.resolve("Test");
    globalContainer.resolve("Test");
    expect(factoryMock.mock.calls.length).toBe(2);
});
test("resolves to factory result each time resolve is called", function () {
    var factoryMock = jest.fn();
    globalContainer.register("Test", { useFactory: factoryMock });
    var value1 = 1;
    var value2 = 2;
    factoryMock.mockReturnValue(value1);
    var result1 = globalContainer.resolve("Test");
    factoryMock.mockReturnValue(value2);
    var result2 = globalContainer.resolve("Test");
    expect(result1).toBe(value1);
    expect(result2).toBe(value2);
});
test("resolves anonymous classes separately", function () {
    var ctor1 = (function () {
        function class_1() {
        }
        return class_1;
    }());
    var ctor2 = (function () {
        function class_2() {
        }
        return class_2;
    }());
    globalContainer.registerInstance(ctor1, new ctor1());
    globalContainer.registerInstance(ctor2, new ctor2());
    expect(globalContainer.resolve(ctor1) instanceof ctor1).toBeTruthy();
    expect(globalContainer.resolve(ctor2) instanceof ctor2).toBeTruthy();
});
test("returns true for a registered singleton class", function () {
    var Bar = (function () {
        function Bar() {
            this.value = "";
        }
        Bar = tslib_1.__decorate([
            injectable()
        ], Bar);
        return Bar;
    }());
    var Foo = (function () {
        function Foo(myBar) {
            this.myBar = myBar;
        }
        Foo = tslib_1.__decorate([
            injectable(),
            tslib_1.__metadata("design:paramtypes", [Bar])
        ], Foo);
        return Foo;
    }());
    globalContainer.registerSingleton(Foo);
    expect(globalContainer.isRegistered(Foo)).toBeTruthy();
});
test("returns true for a registered class provider", function () {
    var Bar = (function () {
        function Bar() {
            this.value = "";
        }
        Bar = tslib_1.__decorate([
            injectable()
        ], Bar);
        return Bar;
    }());
    var Foo = (function () {
        function Foo(myBar) {
            this.myBar = myBar;
        }
        Foo = tslib_1.__decorate([
            injectable(),
            tslib_1.__metadata("design:paramtypes", [Bar])
        ], Foo);
        return Foo;
    }());
    globalContainer.register(Foo, { useClass: Foo });
    expect(globalContainer.isRegistered(Foo)).toBeTruthy();
});
test("returns true for a registered value provider", function () {
    var Bar = (function () {
        function Bar() {
            this.value = "";
        }
        Bar = tslib_1.__decorate([
            injectable()
        ], Bar);
        return Bar;
    }());
    var Foo = (function () {
        function Foo(myBar) {
            this.myBar = myBar;
        }
        Foo = tslib_1.__decorate([
            injectable(),
            tslib_1.__metadata("design:paramtypes", [Bar])
        ], Foo);
        return Foo;
    }());
    globalContainer.register(Foo, { useValue: {} });
    expect(globalContainer.isRegistered(Foo)).toBeTruthy();
});
test("returns true for a registered token provider", function () {
    var Bar = (function () {
        function Bar() {
            this.value = "";
        }
        Bar = tslib_1.__decorate([
            injectable()
        ], Bar);
        return Bar;
    }());
    var Foo = (function () {
        function Foo(myBar) {
            this.myBar = myBar;
        }
        Foo = tslib_1.__decorate([
            injectable(),
            tslib_1.__metadata("design:paramtypes", [Bar])
        ], Foo);
        return Foo;
    }());
    globalContainer.register(Foo, { useToken: "Bar" });
    expect(globalContainer.isRegistered(Foo)).toBeTruthy();
});
test("@injectable resolves when not using DI", function () {
    var Bar = (function () {
        function Bar() {
            this.value = "";
        }
        Bar = tslib_1.__decorate([
            injectable()
        ], Bar);
        return Bar;
    }());
    var Foo = (function () {
        function Foo(myBar) {
            this.myBar = myBar;
        }
        Foo = tslib_1.__decorate([
            injectable(),
            tslib_1.__metadata("design:paramtypes", [Bar])
        ], Foo);
        return Foo;
    }());
    var myValue = "test";
    var myBar = new Bar();
    myBar.value = myValue;
    var myFoo = new Foo(myBar);
    expect(myFoo.myBar.value).toBe(myValue);
});
test("@injectable resolves when using DI", function () {
    var Bar = (function () {
        function Bar() {
            this.value = "";
        }
        Bar = tslib_1.__decorate([
            injectable()
        ], Bar);
        return Bar;
    }());
    var Foo = (function () {
        function Foo(myBar) {
            this.myBar = myBar;
        }
        Foo = tslib_1.__decorate([
            injectable(),
            tslib_1.__metadata("design:paramtypes", [Bar])
        ], Foo);
        return Foo;
    }());
    var myFoo = globalContainer.resolve(Foo);
    expect(myFoo.myBar.value).toBe("");
});
test("@injectable resolves nested depenencies when using DI", function () {
    var Bar = (function () {
        function Bar() {
            this.value = "";
        }
        Bar = tslib_1.__decorate([
            injectable()
        ], Bar);
        return Bar;
    }());
    var Foo = (function () {
        function Foo(myBar) {
            this.myBar = myBar;
        }
        Foo = tslib_1.__decorate([
            injectable(),
            tslib_1.__metadata("design:paramtypes", [Bar])
        ], Foo);
        return Foo;
    }());
    var FooBar = (function () {
        function FooBar(myFoo) {
            this.myFoo = myFoo;
        }
        FooBar = tslib_1.__decorate([
            injectable(),
            tslib_1.__metadata("design:paramtypes", [Foo])
        ], FooBar);
        return FooBar;
    }());
    var myFooBar = globalContainer.resolve(FooBar);
    expect(myFooBar.myFoo.myBar.value).toBe("");
});
test("@injectable preserves static members", function () {
    var value = "foobar";
    var MyStatic = (function () {
        function MyStatic() {
        }
        MyStatic.testFunc = function () {
            return value;
        };
        MyStatic.testVal = value;
        MyStatic = tslib_1.__decorate([
            injectable()
        ], MyStatic);
        return MyStatic;
    }());
    expect(MyStatic.testFunc()).toBe(value);
    expect(MyStatic.testVal).toBe(value);
});
test("@injectable handles optional params", function () {
    var Bar = (function () {
        function Bar() {
            this.value = "";
        }
        Bar = tslib_1.__decorate([
            injectable()
        ], Bar);
        return Bar;
    }());
    var Foo = (function () {
        function Foo(myBar) {
            this.myBar = myBar;
        }
        Foo = tslib_1.__decorate([
            injectable(),
            tslib_1.__metadata("design:paramtypes", [Bar])
        ], Foo);
        return Foo;
    }());
    var MyOptional = (function () {
        function MyOptional(myFoo) {
            this.myFoo = myFoo;
        }
        MyOptional = tslib_1.__decorate([
            injectable(),
            tslib_1.__metadata("design:paramtypes", [Foo])
        ], MyOptional);
        return MyOptional;
    }());
    var myOptional = globalContainer.resolve(MyOptional);
    expect(myOptional.myFoo instanceof Foo).toBeTruthy();
});
test("@singleton registers class as singleton with the global container", function () {
    var Bar = (function () {
        function Bar() {
        }
        Bar = tslib_1.__decorate([
            singleton()
        ], Bar);
        return Bar;
    }());
    var myBar = globalContainer.resolve(Bar);
    var myBar2 = globalContainer.resolve(Bar);
    expect(myBar instanceof Bar).toBeTruthy();
    expect(myBar).toBe(myBar2);
});
test("dependencies of an @singleton can be resolved", function () {
    var Foo = (function () {
        function Foo() {
        }
        return Foo;
    }());
    var Bar = (function () {
        function Bar(foo) {
            this.foo = foo;
        }
        Bar = tslib_1.__decorate([
            singleton(),
            tslib_1.__metadata("design:paramtypes", [Foo])
        ], Bar);
        return Bar;
    }());
    var myBar = globalContainer.resolve(Bar);
    expect(myBar.foo instanceof Foo).toBeTruthy();
});
test("passes through the given params", function () {
    var MyViewModel = (function () {
        function MyViewModel(a, b, c) {
            this.a = a;
            this.b = b;
            this.c = c;
        }
        MyViewModel = tslib_1.__decorate([
            injectable(),
            tslib_1.__metadata("design:paramtypes", [Object, Object, Object])
        ], MyViewModel);
        return MyViewModel;
    }());
    var a = {};
    var b = {};
    var c = {};
    var instance = new MyViewModel(a, b, c);
    expect(instance.a).toBe(a);
    expect(instance.b).toBe(b);
    expect(instance.c).toBe(c);
});
test("doesn't blow up with empty args", function () {
    var RegisteringFoo = (function () {
        function RegisteringFoo() {
        }
        RegisteringFoo = tslib_1.__decorate([
            registry()
        ], RegisteringFoo);
        return RegisteringFoo;
    }());
    expect(function () { return new RegisteringFoo(); }).not.toThrow();
});
test("registers by type provider", function () {
    var Bar = (function () {
        function Bar() {
            this.value = "";
        }
        Bar = tslib_1.__decorate([
            injectable()
        ], Bar);
        return Bar;
    }());
    var RegisteringFoo = (function () {
        function RegisteringFoo() {
        }
        RegisteringFoo = tslib_1.__decorate([
            registry([{ token: Bar, useClass: Bar }])
        ], RegisteringFoo);
        return RegisteringFoo;
    }());
    new RegisteringFoo();
    expect(globalContainer.isRegistered(Bar)).toBeTruthy();
});
test("registers by class provider", function () {
    var Bar = (function () {
        function Bar() {
            this.value = "";
        }
        Bar = tslib_1.__decorate([
            injectable()
        ], Bar);
        return Bar;
    }());
    var registration = {
        token: "IBar",
        useClass: Bar
    };
    var RegisteringFoo = (function () {
        function RegisteringFoo() {
        }
        RegisteringFoo = tslib_1.__decorate([
            registry([registration])
        ], RegisteringFoo);
        return RegisteringFoo;
    }());
    new RegisteringFoo();
    expect(globalContainer.isRegistered(registration.token)).toBeTruthy();
});
test("registers by value provider", function () {
    var registration = {
        token: "IBar",
        useValue: {}
    };
    var RegisteringFoo = (function () {
        function RegisteringFoo() {
        }
        RegisteringFoo = tslib_1.__decorate([
            registry([registration])
        ], RegisteringFoo);
        return RegisteringFoo;
    }());
    new RegisteringFoo();
    expect(globalContainer.isRegistered(registration.token)).toBeTruthy();
});
test("registers by token provider", function () {
    var registration = {
        token: "IBar",
        useToken: "IFoo"
    };
    var RegisteringFoo = (function () {
        function RegisteringFoo() {
        }
        RegisteringFoo = tslib_1.__decorate([
            registry([registration])
        ], RegisteringFoo);
        return RegisteringFoo;
    }());
    new RegisteringFoo();
    expect(globalContainer.isRegistered(registration.token)).toBeTruthy();
});
test("registers by factory provider", function () {
    var registration = {
        token: "IBar",
        useFactory: function (globalContainer) { return globalContainer.resolve(Bar); }
    };
    var Bar = (function () {
        function Bar() {
            this.value = "";
        }
        Bar = tslib_1.__decorate([
            injectable()
        ], Bar);
        return Bar;
    }());
    var RegisteringFoo = (function () {
        function RegisteringFoo() {
        }
        RegisteringFoo = tslib_1.__decorate([
            registry([registration])
        ], RegisteringFoo);
        return RegisteringFoo;
    }());
    new RegisteringFoo();
    expect(globalContainer.isRegistered(registration.token)).toBeTruthy();
});
test("registers mixed types", function () {
    var Bar = (function () {
        function Bar() {
            this.value = "";
        }
        Bar = tslib_1.__decorate([
            injectable()
        ], Bar);
        return Bar;
    }());
    var Foo = (function () {
        function Foo(myBar) {
            this.myBar = myBar;
        }
        Foo = tslib_1.__decorate([
            injectable(),
            tslib_1.__metadata("design:paramtypes", [Bar])
        ], Foo);
        return Foo;
    }());
    var registration = {
        token: "IBar",
        useClass: Bar
    };
    var RegisteringFoo = (function () {
        function RegisteringFoo() {
        }
        RegisteringFoo = tslib_1.__decorate([
            registry([registration, { token: Foo, useClass: Foo }])
        ], RegisteringFoo);
        return RegisteringFoo;
    }());
    new RegisteringFoo();
    expect(globalContainer.isRegistered(registration.token)).toBeTruthy();
    expect(globalContainer.isRegistered(Foo)).toBeTruthy();
});
test("registers by symbol token provider", function () {
    var registration = {
        token: Symbol("obj1"),
        useValue: {}
    };
    var RegisteringFoo = (function () {
        function RegisteringFoo() {
        }
        RegisteringFoo = tslib_1.__decorate([
            registry([registration])
        ], RegisteringFoo);
        return RegisteringFoo;
    }());
    new RegisteringFoo();
    expect(globalContainer.isRegistered(registration.token)).toBeTruthy();
    expect(globalContainer.resolve(registration.token)).toEqual(registration.useValue);
});
test("allows interfaces to be resolved from the constructor with injection token", function () {
    var Bar = (function () {
        function Bar() {
            this.value = "";
        }
        Bar = tslib_1.__decorate([
            injectable()
        ], Bar);
        return Bar;
    }());
    var FooWithInterface = (function () {
        function FooWithInterface(myBar) {
            this.myBar = myBar;
        }
        FooWithInterface = tslib_1.__decorate([
            injectable(),
            registry([{ token: Bar, useClass: Bar }]),
            tslib_1.__param(0, inject(Bar)),
            tslib_1.__metadata("design:paramtypes", [Object])
        ], FooWithInterface);
        return FooWithInterface;
    }());
    var myFoo = globalContainer.resolve(FooWithInterface);
    expect(myFoo.myBar instanceof Bar).toBeTruthy();
});
test("allows interfaces to be resolved from the constructor with just a name", function () {
    var Bar = (function () {
        function Bar() {
            this.value = "";
        }
        Bar = tslib_1.__decorate([
            injectable()
        ], Bar);
        return Bar;
    }());
    var FooWithInterface = (function () {
        function FooWithInterface(myBar) {
            this.myBar = myBar;
        }
        FooWithInterface = tslib_1.__decorate([
            injectable(),
            registry([{
                    token: "IBar",
                    useClass: Bar
                }]),
            tslib_1.__param(0, inject("IBar")),
            tslib_1.__metadata("design:paramtypes", [Object])
        ], FooWithInterface);
        return FooWithInterface;
    }());
    var myFoo = globalContainer.resolve(FooWithInterface);
    expect(myFoo.myBar instanceof Bar).toBeTruthy();
});
test("instanceCachingFactory caches the returned instance", function () {
    var factory = instanceCachingFactory(function () { });
    expect(factory(globalContainer)).toBe(factory(globalContainer));
});
test("instanceCachingFactory caches the returned instance even when there is branching logic in the factory", function () {
    var instanceA = {};
    var instanceB = {};
    var useA = true;
    var factory = instanceCachingFactory(function () { return useA ? instanceA : instanceB; });
    expect(factory(globalContainer)).toBe(instanceA);
    useA = false;
    expect(factory(globalContainer)).toBe(instanceA);
});
test("predicateAwareClassFactory correctly switches the returned instance with caching on", function () {
    var A = (function () {
        function A() {
        }
        return A;
    }());
    var B = (function () {
        function B() {
        }
        return B;
    }());
    var useA = true;
    var factory = predicateAwareClassFactory(function () { return useA; }, A, B);
    expect(factory(globalContainer) instanceof A).toBeTruthy();
    useA = false;
    expect(factory(globalContainer) instanceof B).toBeTruthy();
});
test("predicateAwareClassFactory returns the same instance each call with caching on", function () {
    var A = (function () {
        function A() {
        }
        return A;
    }());
    var B = (function () {
        function B() {
        }
        return B;
    }());
    var factory = predicateAwareClassFactory(function () { return true; }, A, B);
    expect(factory(globalContainer)).toBe(factory(globalContainer));
});
test("predicateAwareClassFactory correctly switches the returned instance with caching off", function () {
    var A = (function () {
        function A() {
        }
        return A;
    }());
    var B = (function () {
        function B() {
        }
        return B;
    }());
    var useA = true;
    var factory = predicateAwareClassFactory(function () { return useA; }, A, B, false);
    expect(factory(globalContainer) instanceof A).toBeTruthy();
    useA = false;
    expect(factory(globalContainer) instanceof B).toBeTruthy();
});
test("predicateAwareClassFactory returns new instances each call with caching off", function () {
    var A = (function () {
        function A() {
        }
        return A;
    }());
    var B = (function () {
        function B() {
        }
        return B;
    }());
    var factory = predicateAwareClassFactory(function () { return true; }, A, B, false);
    expect(factory(globalContainer)).not.toBe(factory(globalContainer));
});
