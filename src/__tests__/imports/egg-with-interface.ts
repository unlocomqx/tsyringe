import {injectable, lazyInject, registry} from "../../decorators";
import {IChicken} from "./chicken-with-interface";

// tslint:disable-next-line:no-empty-interface
export interface IEgg { }

@injectable()
@registry([{
  token: "IChicken",
  useToken: "ChickenWithInterface"
}])
export class EggWithInterface {
  // @ts-ignore: ignores no initializer
  @lazyInject("IChicken") public chicken: IChicken;

  constructor() {
  }
}
