import { isClassProvider, isFactoryProvider, isNormalToken, isTokenProvider, isValueProvider } from "./providers";
var DependencyContainer = (function () {
    function DependencyContainer(parent) {
        this.parent = parent;
        this._registry = new Map();
    }
    DependencyContainer.prototype.register = function (token, provider, options) {
        if (options === void 0) { options = { singleton: false }; }
        if (options.singleton) {
            if (isValueProvider(provider) || isFactoryProvider(provider)) {
                throw "Cannot use {singleton: true} with ValueProviders or FactoryProviders";
            }
        }
        if (isTokenProvider(provider) && typeof provider.useToken === "string") {
            lazyRegistrationInfo.set(provider.useToken, token);
        }
        this._registry.set(token, { provider: provider, options: options });
        return this;
    };
    DependencyContainer.prototype.registerType = function (from, to) {
        if (isNormalToken(to)) {
            return this.register(from, {
                useToken: to
            });
        }
        return this.register(from, {
            useClass: to
        });
    };
    DependencyContainer.prototype.registerInstance = function (token, instance) {
        return this.register(token, {
            useValue: instance
        });
    };
    DependencyContainer.prototype.registerSingleton = function (from, to) {
        if (isNormalToken(from)) {
            if (isNormalToken(to)) {
                return this.register(from, {
                    useToken: to
                }, { singleton: true });
            }
            else if (to) {
                return this.register(from, {
                    useClass: to
                }, { singleton: true });
            }
            throw "Cannot register a type name as a singleton without a \"to\" token";
        }
        return this.register(from, {
            useClass: from
        }, { singleton: true });
    };
    DependencyContainer.prototype.resolve = function (token) {
        if (!token) {
            throw "Attempted to resolve an undefined dependency token";
        }
        this.assignLazyRegistration(token);
        this.assignLazyProps(token);
        var registration = this.getRegistration(token);
        if (!registration) {
            if (isNormalToken(token)) {
                throw "Attempted to resolve unregistered dependency token: " + token.toString();
            }
        }
        if (registration) {
            if (isValueProvider(registration.provider)) {
                return registration.provider.useValue;
            }
            else if (isTokenProvider(registration.provider)) {
                return registration.options.singleton ?
                    (registration.instance || (registration.instance = this.resolve(registration.provider.useToken))) :
                    this.resolve(registration.provider.useToken);
            }
            else if (isClassProvider(registration.provider)) {
                return registration.options.singleton ?
                    (registration.instance || (registration.instance = this.construct(registration.provider.useClass))) :
                    this.construct(registration.provider.useClass);
            }
            else if (isFactoryProvider(registration.provider)) {
                return registration.provider.useFactory(this);
            }
            else {
                return this.construct(registration.provider);
            }
        }
        return this.construct(token);
    };
    DependencyContainer.prototype.assignLazyProps = function (token) {
        var _this = this;
        var key = token.name;
        var propsInfos = lazyPropsInfo.get(key) || [];
        if (propsInfos.length === 0) {
            return;
        }
        lazyPropsInfo.delete(key);
        var lazyRegistration = lazyRegistrationInfo.get(key) || [];
        if (lazyRegistration) {
            lazyPropsInfo.delete(lazyRegistration);
        }
        propsInfos.map(function (propsInfo) {
            propsInfo.target[propsInfo.property] = _this.resolve(token);
        });
    };
    DependencyContainer.prototype.assignLazyRegistration = function (token) {
        var key = token.name;
        var lazyRegistration = lazyRegistrationInfo.get(key) || [];
        var propsInfos = lazyPropsInfo.get(lazyRegistration) || [];
        if (propsInfos.length) {
            lazyPropsInfo.set(key, propsInfos);
        }
    };
    DependencyContainer.prototype.isRegistered = function (token) {
        return this._registry.has(token);
    };
    DependencyContainer.prototype.reset = function () {
        this._registry.clear();
    };
    DependencyContainer.prototype.createChildContainer = function () {
        return new DependencyContainer(this);
    };
    DependencyContainer.prototype.getRegistration = function (token) {
        if (this.isRegistered(token)) {
            return this._registry.get(token);
        }
        if (this.parent) {
            return this.parent.getRegistration(token);
        }
        return null;
    };
    DependencyContainer.prototype.construct = function (ctor) {
        var _this = this;
        if (ctor.length === 0) {
            return new ctor();
        }
        var paramInfo = typeInfo.get(ctor);
        if (!paramInfo || paramInfo.length === 0) {
            throw "TypeInfo not known for " + ctor;
        }
        var params = paramInfo.map(function (param) { return _this.resolve(param); });
        return new (ctor.bind.apply(ctor, [void 0].concat(params)))();
    };
    return DependencyContainer;
}());
export { DependencyContainer };
export var typeInfo = new Map();
export var lazyPropsInfo = new Map();
export var lazyRegistrationInfo = new Map();
export var instance = new DependencyContainer();
