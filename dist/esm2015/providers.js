export function isClassProvider(provider) {
    return !!provider.useClass;
}
export function isValueProvider(provider) {
    return provider.useValue != undefined;
}
export function isTokenProvider(provider) {
    return !!provider.useToken;
}
export function isFactoryProvider(provider) {
    return !!provider.useFactory;
}
export function isNormalToken(token) {
    return typeof token === "string" || typeof token === "symbol";
}
