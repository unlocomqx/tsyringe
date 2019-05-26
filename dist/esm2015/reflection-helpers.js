export const INJECTION_TOKEN_METADATA_KEY = "injectionTokens";
export function getParamInfo(target) {
    const params = Reflect.getMetadata("design:paramtypes", target) || [];
    params.map((param, index) => {
        if (!param) {
            throw `Unable to resolve parameter #${index + 1} of ${target.name}.
      This could mean there is a circular dependency issue. Try using @lazyInject`;
        }
    });
    const injectionTokens = Reflect.getOwnMetadata(INJECTION_TOKEN_METADATA_KEY, target) || {};
    Object.keys(injectionTokens).forEach(key => {
        params[+key] = injectionTokens[key];
    });
    return params;
}
