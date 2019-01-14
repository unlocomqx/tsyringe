import {injectable, lazyInject} from "../../decorators";
import {Chicken} from "./chicken";

@injectable()
export class Egg {
  // @ts-ignore: ignores no initializer
  @lazyInject("Chicken") public chicken: Chicken;

  constructor() {
  }
}
