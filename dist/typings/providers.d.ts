import { DependencyContainer } from "./types";
import { constructor } from "./types";
export declare type InjectionToken<T = any> = constructor<T> | string | symbol;
export interface ClassProvider<T> {
    useClass: constructor<T>;
}
export interface ValueProvider<T> {
    useValue: T;
}
export interface TokenProvider<T> {
    useToken: InjectionToken<T>;
}
/**
 * Provide a dependency using a factory.
 * Unlike the other providers, this does not support instance caching. If
 * you need instance caching, your factory method must implement it.
 */
export interface FactoryProvider<T> {
    useFactory: (dependencyContainer: DependencyContainer) => T;
}
export declare type Provider<T> = ClassProvider<T> | ValueProvider<T> | TokenProvider<T> | FactoryProvider<T>;
export declare function isClassProvider<T>(provider: Provider<T>): provider is ClassProvider<any>;
export declare function isValueProvider<T>(provider: Provider<T>): provider is ValueProvider<T>;
export declare function isTokenProvider<T>(provider: Provider<T>): provider is TokenProvider<any>;
export declare function isFactoryProvider<T>(provider: Provider<T>): provider is FactoryProvider<any>;
export declare function isNormalToken(token?: InjectionToken<any>): token is string | symbol;
