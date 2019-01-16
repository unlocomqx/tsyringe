"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const providers_1 = require("./providers");
class DependencyContainer {
    constructor(parent) {
        this.parent = parent;
        this._registry = new Map();
    }
    register(token, provider, options = { singleton: false }) {
        if (options.singleton) {
            if (providers_1.isValueProvider(provider) || providers_1.isFactoryProvider(provider)) {
                throw "Cannot use {singleton: true} with ValueProviders or FactoryProviders";
            }
        }
        this._registry.set(token, { provider, options });
        return this;
    }
    registerType(from, to) {
        if (providers_1.isNormalToken(to)) {
            return this.register(from, {
                useToken: to
            });
        }
        return this.register(from, {
            useClass: to
        });
    }
    registerInstance(token, instance) {
        return this.register(token, {
            useValue: instance
        });
    }
    registerSingleton(from, to) {
        if (providers_1.isNormalToken(from)) {
            if (providers_1.isNormalToken(to)) {
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
    }
    resolve(token) {
        if (!token) {
            throw `Attempted to resolve an undefined dependency token`;
        }
        this.assignLazyProps(token);
        const registration = this.getRegistration(token);
        if (!registration) {
            if (providers_1.isNormalToken(token)) {
                throw `Attempted to resolve unregistered dependency token: ${token.toString()}`;
            }
        }
        if (registration) {
            if (providers_1.isValueProvider(registration.provider)) {
                return registration.provider.useValue;
            }
            else if (providers_1.isTokenProvider(registration.provider)) {
                return registration.options.singleton ?
                    (registration.instance || (registration.instance = this.resolve(registration.provider.useToken))) :
                    this.resolve(registration.provider.useToken);
            }
            else if (providers_1.isClassProvider(registration.provider)) {
                return registration.options.singleton ?
                    (registration.instance || (registration.instance = this.construct(registration.provider.useClass))) :
                    this.construct(registration.provider.useClass);
            }
            else if (providers_1.isFactoryProvider(registration.provider)) {
                return registration.provider.useFactory(this);
            }
            else {
                return this.construct(registration.provider);
            }
        }
        return this.construct(token);
    }
    assignLazyProps(token) {
        const key = token.name;
        const propsInfos = exports.lazyPropsInfo.get(key) || [];
        if (propsInfos.length === 0) {
            return;
        }
        exports.lazyPropsInfo.delete(key);
        propsInfos.map((propsInfo) => {
            propsInfo.target[propsInfo.property] = this.resolve(token);
        });
    }
    isRegistered(token) {
        return this._registry.has(token);
    }
    reset() {
        this._registry.clear();
    }
    createChildContainer() {
        return new DependencyContainer(this);
    }
    getRegistration(token) {
        if (this.isRegistered(token)) {
            return this._registry.get(token);
        }
        if (this.parent) {
            return this.parent.getRegistration(token);
        }
        return null;
    }
    construct(ctor) {
        if (ctor.length === 0) {
            return new ctor();
        }
        const paramInfo = exports.typeInfo.get(ctor);
        if (!paramInfo || paramInfo.length === 0) {
            throw `TypeInfo not known for ${ctor}`;
        }
        const params = paramInfo.map(param => this.resolve(param));
        return new ctor(...params);
    }
}
exports.DependencyContainer = DependencyContainer;
exports.typeInfo = new Map();
exports.lazyPropsInfo = new Map();
exports.instance = new DependencyContainer();
