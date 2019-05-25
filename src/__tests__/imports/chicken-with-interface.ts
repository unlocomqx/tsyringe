import {injectable, lazyInject, registry} from "../../decorators";
import {IEgg} from "./egg-with-interface";

// tslint:disable-next-line:no-empty-interface
export interface IChicken {
}

@injectable()
@registry([{
  token   : "IEgg",
  useToken: "EggWithInterface"
}])
export class ChickenWithInterface implements IChicken {
  // @ts-ignore: ignores no initializer
  @lazyInject("IEgg") public egg: IEgg;

  constructor() {
  }
}
