import { DependencyContainer, constructor } from "./types";
export declare type FactoryFunction<T> = (dependencyContainer: DependencyContainer) => T;
export declare function instanceCachingFactory<T>(factoryFunc: FactoryFunction<T>): FactoryFunction<T>;
export declare function predicateAwareClassFactory<T>(predicate: (dependencyContainer: DependencyContainer) => boolean, trueConstructor: constructor<T>, falseConstructor: constructor<T>, useCaching?: boolean): FactoryFunction<T>;
