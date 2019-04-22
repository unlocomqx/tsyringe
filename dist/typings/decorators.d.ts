import { InjectionToken, Provider } from "./providers";
import { RegistrationOptions, constructor } from "./types";
/**
 * Class decorator factory that allows the class' dependencies to be injected
 * at runtime.
 *
 * @return {Function} The class decorator
 */
export declare function injectable<T>(): (target: constructor<T>) => void;
/**
 * Class decorator factory that registers the class as a singleton within
 * the global container.
 *
 * @return {Function} The class decorator
 */
export declare function singleton<T>(): (target: constructor<T>) => void;
/**
 * Class decorator factory that replaces the decorated class' constructor with
 * a parameterless constructor that has dependencies auto-resolved
 *
 * Note: Resolution is performed using the global container
 *
 * @return {Function} The class decorator
 */
export declare function autoInjectable(): (target: constructor<any>) => any;
/**
 * Parameter decorator factory that allows for interface information to be stored in the constructor's metadata
 *
 * @return {Function} The parameter decorator
 */
export declare function inject(token: InjectionToken<any>): (target: any, propertyKey: string | symbol, parameterIndex: number) => any;
/**
 * Parameter decorator factory that allows for interface information to be stored in the constructor's metadata
 *
 * @return {Function} The parameter decorator
 */
export declare function lazyInject(token: InjectionToken<any>): (target: any, propertyKey: string) => any;
/**
 * Class decorator factory that allows constructor dependencies to be registered at runtime.
 *
 * @return {Function} The class decorator
 */
export declare function registry(registrations?: ({
    token: InjectionToken;
    options?: RegistrationOptions;
} & Provider<any>)[]): (target: any) => any;
