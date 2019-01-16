[![Travis](https://img.shields.io/travis/Microsoft/tsyringe.svg)](https://travis-ci.org/Microsoft/tsyringe/)
[![npm](https://img.shields.io/npm/v/tsyringe.svg)](https://www.npmjs.com/package/tsyringe)
[![npm](https://img.shields.io/npm/dt/tsyringe.svg)](https://www.npmjs.com/package/tsyringe)

# TSyringe

A lightweight dependency injection container for TypeScript/JavaScript for
constructor injection.

* [Installation](#installation)
* [API](#api)
  * [injectable()](#injectable)
  * [singleton()](#singleton)
  * [autoInjectable()](#autoinjectable)
  * [inject()](#inject)
  * [lazyInject()](#lazyinject)
* [Full Examples](#full-examples)
* [Contributing](#contributing)

## Installation
Install by `npm`
```sh
npm install --save tsyringe
```

**or** install with `yarn` (this project is developed using `yarn`)
```sh
yarn add tsyringe
```

Modify your `tsconfig.json` to include the following settings
```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

Add a polyfill for the Reflect API (examples below use reflect-metadata). You can use:

 * [reflect-metadata](https://www.npmjs.com/package/reflect-metadata)
 * [core-js (core-js/es7/reflect)](https://www.npmjs.com/package/core-js)
 * [reflection](https://www.npmjs.com/package/@abraham/reflection)

The Reflect polyfill import should only be added once before DI is used.

## API
### injectable()
Class decorator factory that allows the class' dependencies to be injected at
runtime.

#### Usage
```typescript
import {injectable} from "tsyringe";

@injectable()
class Foo {
  constructor(private database: Database) {}
}

// some other file
import "reflect-metadata";
import {container} from "tsyringe";
import {Foo} from "./foo";

const instance = container.resolve(Foo);
```

### singleton()
Class decorator factory that registers the class as a singleton within the
global container.

#### Usage
```typescript
import {singleton} from "tsyringe";

@singleton()
class Foo {
  constructor() {}
}

// some other file
import "reflect-metadata";
import {container} from "tsyringe";
import {Foo} from "./foo";

const instance = container.resolve(Foo);
```

### autoInjectable()
Class decorator factory that replaces the decorated class' constructor with
a parameterless constructor that has dependencies auto-resolved.

**Note** Resolution is performed using the global container

#### Usage
```typescript
import {autoInjectable} from "tsyringe";

@autoInjectable()
class Foo {
  constructor(private database?: Database) {}
}

// some other file
import {Foo} from "./foo";

const instance = new Foo();
```

Notice how in order to allow the use of the empty constructor `new Foo()`, we
need to make the parameters optional, e.g. `database?: Database`

### inject()
Property decorator factory that allows for interface and other non-class
information to be stored in the constructor's metadata

#### Usage
```typescript
import {injectable, inject} from "tsyringe";

interface Database {
  // ...
}

@injectable()
class Foo {
  constructor(@inject("Database") private database?: Database) {}
}
```

### lazyInject()
Property decorator that allows to lazily resolve a dependency if it can not be resolved
when resolving the current class 

#### Usage
```typescript
// file: chicken.ts
@injectable()
export class Chicken {
  @lazyInject("Egg") public egg: Egg;

  constructor() { }
}

// file: egg.ts
@injectable()
export class Egg {
  @lazyInject("Chicken") public chicken: Chicken;

  constructor() { }
}
```

## Full examples
### Example without interfaces
Since classes have type information at runtime, we can resolve them without any
extra information.

```typescript
// Foo.ts
export class Foo {}
```
```typescript
// Bar.ts
import {Foo} from "./Foo";
import {injectable} from "tsyringe";

@injectable()
export class Bar {
  constructor(public myFoo: Foo) {}
}
```
```typescript
// main.ts
import "reflect-metadata";
import {container} from "tsyringe";
import {Bar} from "./Bar";

const myBar = container.resolve(Bar);
// myBar.myFoo => An instance of Foo
```

### Example with interfaces
Interfaces don't have type information at runtime, so we need to decorate them
with `@inject(...)` so the container knows how to resolve them.

```typescript
// SuperService.ts
export interface SuperService {
  // ...
}
```
```typescript
// TestService.ts
import {SuperService} from "./SuperService";
export class TestService implements SuperService {
  //...
}
```
```typescript
// Client.ts
import {injectable, inject} from "tsyringe";

@injectable()
export class Client {
  constructor(@inject("SuperService") private service: SuperService) {}
}
```
```typescript
// main.ts
import "reflect-metadata";
import {Client} from "./Client";
import {TestService} from "./TestService";
import {container} from "tsyringe";

container.register(
  "SuperService", {
  useClass: TestService
});

const client = container.resolve(Client);
// client's dependencies will have been resolved
```

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit [https://cla.microsoft.com](https://cla.microsoft.com).

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
