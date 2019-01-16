"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const reflection_helpers_1 = require("./reflection-helpers");
const dependency_container_1 = require("./dependency-container");
function injectable() {
    return function (target) {
        dependency_container_1.typeInfo.set(target, reflection_helpers_1.getParamInfo(target));
    };
}
exports.injectable = injectable;
function singleton() {
    return function (target) {
        injectable()(target);
        dependency_container_1.instance.registerSingleton(target);
    };
}
exports.singleton = singleton;
function autoInjectable() {
    return function (target) {
        const paramInfo = reflection_helpers_1.getParamInfo(target);
        return class extends target {
            constructor(...args) {
                super(...args.concat(paramInfo.slice(args.length).map(type => dependency_container_1.instance.resolve(type))));
            }
        };
    };
}
exports.autoInjectable = autoInjectable;
function inject(token) {
    return function (target, _propertyKey, parameterIndex) {
        const injectionTokens = Reflect.getOwnMetadata(reflection_helpers_1.INJECTION_TOKEN_METADATA_KEY, target) || {};
        injectionTokens[parameterIndex] = token;
        Reflect.defineMetadata(reflection_helpers_1.INJECTION_TOKEN_METADATA_KEY, injectionTokens, target);
    };
}
exports.inject = inject;
function lazyInject(token) {
    return function (target, _propertyKey) {
        const info = dependency_container_1.lazyPropsInfo.get(token) || [];
        info.push({
            target: target,
            property: _propertyKey
        });
        dependency_container_1.lazyPropsInfo.set(token, info);
    };
}
exports.lazyInject = lazyInject;
function registry(registrations = []) {
    return function (target) {
        registrations.forEach((_a) => {
            var { token, options } = _a, provider = tslib_1.__rest(_a, ["token", "options"]);
            return dependency_container_1.instance.register(token, provider, options);
        });
        return target;
    };
}
exports.registry = registry;
