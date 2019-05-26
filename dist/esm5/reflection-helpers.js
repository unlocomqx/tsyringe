export var INJECTION_TOKEN_METADATA_KEY = "injectionTokens";
export function getParamInfo(target) {
    var params = Reflect.getMetadata("design:paramtypes", target) || [];
    params.map(function (param, index) {
        if (!param) {
            throw "Unable to resolve parameter #" + (index + 1) + " of " + target.name + ".\n      This could mean there is a circular dependency issue. Try using @lazyInject";
        }
    });
    var injectionTokens = Reflect.getOwnMetadata(INJECTION_TOKEN_METADATA_KEY, target) || {};
    Object.keys(injectionTokens).forEach(function (key) {
        params[+key] = injectionTokens[key];
    });
    return params;
}
