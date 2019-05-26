"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isClassProvider(provider) {
    return !!provider.useClass;
}
exports.isClassProvider = isClassProvider;
function isValueProvider(provider) {
    return provider.useValue != undefined;
}
exports.isValueProvider = isValueProvider;
function isTokenProvider(provider) {
    return !!provider.useToken;
}
exports.isTokenProvider = isTokenProvider;
function isFactoryProvider(provider) {
    return !!provider.useFactory;
}
exports.isFactoryProvider = isFactoryProvider;
function isNormalToken(token) {
    return typeof token === "string" || typeof token === "symbol";
}
exports.isNormalToken = isNormalToken;
