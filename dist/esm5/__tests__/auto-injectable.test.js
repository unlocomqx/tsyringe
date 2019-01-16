import * as tslib_1 from "tslib";
import { autoInjectable, injectable } from "../decorators";
import { instance as globalContainer } from "../dependency-container";
afterEach(function () {
    globalContainer.reset();
});
test("@autoInjectable allows for injection to be performed without using .resolve()", function () {
    var Bar = (function () {
        function Bar() {
        }
        return Bar;
    }());
    var Foo = (function () {
        function Foo(myBar) {
            this.myBar = myBar;
        }
        Foo = tslib_1.__decorate([
            autoInjectable(),
            tslib_1.__metadata("design:paramtypes", [Bar])
        ], Foo);
        return Foo;
    }());
    var myFoo = new Foo();
    expect(myFoo.myBar instanceof Bar).toBeTruthy();
});
test("@autoInjectable allows for parameters to be specified manually", function () {
    var Bar = (function () {
        function Bar() {
        }
        return Bar;
    }());
    var Foo = (function () {
        function Foo(myBar) {
            this.myBar = myBar;
        }
        Foo = tslib_1.__decorate([
            autoInjectable(),
            tslib_1.__metadata("design:paramtypes", [Bar])
        ], Foo);
        return Foo;
    }());
    var myBar = new Bar();
    var myFoo = new Foo(myBar);
    expect(myFoo.myBar).toBe(myBar);
});
test("@autoInjectable injects parameters beyond those specified manually", function () {
    var Bar = (function () {
        function Bar() {
        }
        return Bar;
    }());
    var FooBar = (function () {
        function FooBar() {
        }
        return FooBar;
    }());
    var Foo = (function () {
        function Foo(myFooBar, myBar) {
            this.myFooBar = myFooBar;
            this.myBar = myBar;
        }
        Foo = tslib_1.__decorate([
            autoInjectable(),
            tslib_1.__metadata("design:paramtypes", [FooBar, Bar])
        ], Foo);
        return Foo;
    }());
    var myFooBar = new FooBar();
    var myFoo = new Foo(myFooBar);
    expect(myFoo.myFooBar).toBe(myFooBar);
    expect(myFoo.myBar instanceof Bar).toBeTruthy();
});
test("@autoInjectable works when the @autoInjectable is a polymorphic ancestor", function () {
    var Foo = (function () {
        function Foo() {
        }
        return Foo;
    }());
    var Ancestor = (function () {
        function Ancestor(myFoo) {
            this.myFoo = myFoo;
        }
        Ancestor = tslib_1.__decorate([
            autoInjectable(),
            tslib_1.__metadata("design:paramtypes", [Foo])
        ], Ancestor);
        return Ancestor;
    }());
    var Child = (function (_super) {
        tslib_1.__extends(Child, _super);
        function Child() {
            return _super.call(this) || this;
        }
        return Child;
    }(Ancestor));
    var instance = new Child();
    expect(instance.myFoo instanceof Foo).toBeTruthy();
});
test("@autoInjectable classes keep behavior from their ancestor's constructors", function () {
    var a = 5;
    var b = 4;
    var Foo = (function () {
        function Foo() {
        }
        return Foo;
    }());
    var Ancestor = (function () {
        function Ancestor(myFoo) {
            this.myFoo = myFoo;
            this.a = a;
        }
        Ancestor = tslib_1.__decorate([
            autoInjectable(),
            tslib_1.__metadata("design:paramtypes", [Foo])
        ], Ancestor);
        return Ancestor;
    }());
    var Child = (function (_super) {
        tslib_1.__extends(Child, _super);
        function Child() {
            var _this = _super.call(this) || this;
            _this.b = b;
            return _this;
        }
        return Child;
    }(Ancestor));
    var instance = new Child();
    expect(instance.a).toBe(a);
    expect(instance.b).toBe(b);
});
test("@autoInjectable classes resolve their @injectable dependencies", function () {
    var Foo = (function () {
        function Foo() {
        }
        return Foo;
    }());
    var Bar = (function () {
        function Bar(myFoo) {
            this.myFoo = myFoo;
        }
        Bar = tslib_1.__decorate([
            injectable(),
            tslib_1.__metadata("design:paramtypes", [Foo])
        ], Bar);
        return Bar;
    }());
    var FooBar = (function () {
        function FooBar(myBar) {
            this.myBar = myBar;
        }
        FooBar = tslib_1.__decorate([
            autoInjectable(),
            tslib_1.__metadata("design:paramtypes", [Bar])
        ], FooBar);
        return FooBar;
    }());
    var myFooBar = new FooBar();
    expect(myFooBar.myBar.myFoo instanceof Foo).toBeTruthy();
});
