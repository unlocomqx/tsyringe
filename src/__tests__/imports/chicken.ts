import {injectable, lazyInject} from "../../decorators";
import {Egg} from "./egg";

@injectable()
export class Chicken {
  // @ts-ignore: ignores no initializer
  @lazyInject("Egg") public egg: Egg;

  constructor() { }
}
