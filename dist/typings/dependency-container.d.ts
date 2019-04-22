import * as Types from "./types";
import { ClassProvider, FactoryProvider, InjectionToken, TokenProvider, ValueProvider } from "./providers";
import { RegistrationOptions, constructor } from "./types";
/** Dependency Container */
export declare class DependencyContainer implements Types.DependencyContainer {
    private parent?;
    private _registry;
    constructor(parent?: DependencyContainer | undefined);
    /**
     * Register a dependency provider.
     *
     * @param provider {Provider} The dependency provider
     */
    register<T>(token: InjectionToken<T>, provider: ValueProvider<T>): DependencyContainer;
    register<T>(token: InjectionToken<T>, provider: FactoryProvider<T>): DependencyContainer;
    register<T>(token: InjectionToken<T>, provider: TokenProvider<T>, options?: RegistrationOptions): DependencyContainer;
    register<T>(token: InjectionToken<T>, provider: ClassProvider<T>, options?: RegistrationOptions): DependencyContainer;
    registerType<T>(from: InjectionToken<T>, to: InjectionToken<T>): DependencyContainer;
    registerInstance<T>(token: InjectionToken<T>, instance: T): DependencyContainer;
    registerSingleton<T>(from: InjectionToken<T>, to: InjectionToken<T>): DependencyContainer;
    registerSingleton<T>(token: constructor<T>): DependencyContainer;
    /**
     * Resolve a token into an instance
     *
     * @param token {InjectionToken} The dependency token
     * @return {T} An instance of the dependency
     */
    resolve<T>(token: InjectionToken<T>): T;
    private assignLazyProps;
    /**
     * Check if the given dependency is registered
     *
     * @return {boolean}
     */
    isRegistered<T>(token: InjectionToken<T>): boolean;
    /**
     * Clears all registered tokens
     */
    reset(): void;
    createChildContainer(): Types.DependencyContainer;
    private getRegistration;
    private construct;
}
export declare const typeInfo: Map<Types.constructor<any>, any[]>;
export declare const lazyPropsInfo: Map<InjectionToken<any>, Types.PropertyInfo[]>;
export declare const instance: Types.DependencyContainer;
