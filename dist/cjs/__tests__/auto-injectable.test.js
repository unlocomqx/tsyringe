"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const decorators_1 = require("../decorators");
const dependency_container_1 = require("../dependency-container");
afterEach(() => {
    dependency_container_1.instance.reset();
});
test("@autoInjectable allows for injection to be performed without using .resolve()", () => {
    class Bar {
    }
    let Foo = class Foo {
        constructor(myBar) {
            this.myBar = myBar;
        }
    };
    Foo = tslib_1.__decorate([
        decorators_1.autoInjectable(),
        tslib_1.__metadata("design:paramtypes", [Bar])
    ], Foo);
    const myFoo = new Foo();
    expect(myFoo.myBar instanceof Bar).toBeTruthy();
});
test("@autoInjectable allows for parameters to be specified manually", () => {
    class Bar {
    }
    let Foo = class Foo {
        constructor(myBar) {
            this.myBar = myBar;
        }
    };
    Foo = tslib_1.__decorate([
        decorators_1.autoInjectable(),
        tslib_1.__metadata("design:paramtypes", [Bar])
    ], Foo);
    const myBar = new Bar();
    const myFoo = new Foo(myBar);
    expect(myFoo.myBar).toBe(myBar);
});
test("@autoInjectable injects parameters beyond those specified manually", () => {
    class Bar {
    }
    class FooBar {
    }
    let Foo = class Foo {
        constructor(myFooBar, myBar) {
            this.myFooBar = myFooBar;
            this.myBar = myBar;
        }
    };
    Foo = tslib_1.__decorate([
        decorators_1.autoInjectable(),
        tslib_1.__metadata("design:paramtypes", [FooBar, Bar])
    ], Foo);
    const myFooBar = new FooBar();
    const myFoo = new Foo(myFooBar);
    expect(myFoo.myFooBar).toBe(myFooBar);
    expect(myFoo.myBar instanceof Bar).toBeTruthy();
});
test("@autoInjectable works when the @autoInjectable is a polymorphic ancestor", () => {
    class Foo {
        constructor() { }
    }
    let Ancestor = class Ancestor {
        constructor(myFoo) {
            this.myFoo = myFoo;
        }
    };
    Ancestor = tslib_1.__decorate([
        decorators_1.autoInjectable(),
        tslib_1.__metadata("design:paramtypes", [Foo])
    ], Ancestor);
    class Child extends Ancestor {
        constructor() {
            super();
        }
    }
    const instance = new Child();
    expect(instance.myFoo instanceof Foo).toBeTruthy();
});
test("@autoInjectable classes keep behavior from their ancestor's constructors", () => {
    const a = 5;
    const b = 4;
    class Foo {
        constructor() { }
    }
    let Ancestor = class Ancestor {
        constructor(myFoo) {
            this.myFoo = myFoo;
            this.a = a;
        }
    };
    Ancestor = tslib_1.__decorate([
        decorators_1.autoInjectable(),
        tslib_1.__metadata("design:paramtypes", [Foo])
    ], Ancestor);
    class Child extends Ancestor {
        constructor() {
            super();
            this.b = b;
        }
    }
    const instance = new Child();
    expect(instance.a).toBe(a);
    expect(instance.b).toBe(b);
});
test("@autoInjectable classes resolve their @injectable dependencies", () => {
    class Foo {
    }
    let Bar = class Bar {
        constructor(myFoo) {
            this.myFoo = myFoo;
        }
    };
    Bar = tslib_1.__decorate([
        decorators_1.injectable(),
        tslib_1.__metadata("design:paramtypes", [Foo])
    ], Bar);
    let FooBar = class FooBar {
        constructor(myBar) {
            this.myBar = myBar;
        }
    };
    FooBar = tslib_1.__decorate([
        decorators_1.autoInjectable(),
        tslib_1.__metadata("design:paramtypes", [Bar])
    ], FooBar);
    const myFooBar = new FooBar();
    expect(myFooBar.myBar.myFoo instanceof Foo).toBeTruthy();
});
