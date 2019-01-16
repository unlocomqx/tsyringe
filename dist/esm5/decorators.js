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
        var paramInfo = getParamInfo(target);
        return (function (_super) {
            tslib_1.__extends(class_1, _super);
            function class_1() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return _super.apply(this, args.concat(paramInfo.slice(args.length).map(function (type) { return globalContainer.resolve(type); }))) || this;
            }
            return class_1;
        }(target));
    };
}
export function inject(token) {
    return function (target, _propertyKey, parameterIndex) {
        var injectionTokens = Reflect.getOwnMetadata(INJECTION_TOKEN_METADATA_KEY, target) || {};
        injectionTokens[parameterIndex] = token;
        Reflect.defineMetadata(INJECTION_TOKEN_METADATA_KEY, injectionTokens, target);
    };
}
export function lazyInject(token) {
    return function (target, _propertyKey) {
        var info = lazyPropsInfo.get(token) || [];
        info.push({
            target: target,
            property: _propertyKey
        });
        lazyPropsInfo.set(token, info);
    };
}
export function registry(registrations) {
    if (registrations === void 0) { registrations = []; }
    return function (target) {
        registrations.forEach(function (_a) {
            var token = _a.token, options = _a.options, provider = tslib_1.__rest(_a, ["token", "options"]);
            return globalContainer.register(token, provider, options);
        });
        return target;
    };
}
