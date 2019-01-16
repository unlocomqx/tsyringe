import * as tslib_1 from "tslib";
import { INJECTION_TOKEN_METADATA_KEY, getParamInfo } from "./reflection-helpers";
import { instance as globalContainer, lazyPropsInfo, typeInfo } from "./dependency-container";
export function injectable() {
    return function (target) {
        typeInfo.set(target, getParamInfo(target));
    };
}
export function singleton() {
    return function (target) {
        injectable()(target);
        globalContainer.registerSingleton(target);
    };
}
export function autoInjectable() {
    return function (target) {
        const paramInfo = getParamInfo(target);
        return class extends target {
            constructor(...args) {
                super(...args.concat(paramInfo.slice(args.length).map(type => globalContainer.resolve(type))));
            }
        };
    };
}
export function inject(token) {
    return function (target, _propertyKey, parameterIndex) {
        const injectionTokens = Reflect.getOwnMetadata(INJECTION_TOKEN_METADATA_KEY, target) || {};
        injectionTokens[parameterIndex] = token;
        Reflect.defineMetadata(INJECTION_TOKEN_METADATA_KEY, injectionTokens, target);
    };
}
export function lazyInject(token) {
    return function (target, _propertyKey) {
        const info = lazyPropsInfo.get(token) || [];
        info.push({
            target: target,
            property: _propertyKey
        });
        lazyPropsInfo.set(token, info);
    };
}
export function registry(registrations = []) {
    return function (target) {
        registrations.forEach((_a) => {
            var { token, options } = _a, provider = tslib_1.__rest(_a, ["token", "options"]);
            return globalContainer.register(token, provider, options);
        });
        return target;
    };
}
