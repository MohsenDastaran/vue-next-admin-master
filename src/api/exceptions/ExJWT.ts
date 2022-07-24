import { IntfExBase } from "./IntfExBase";

export default class ExJWT extends IntfExBase {
  constructor(m: string, private JWT: string) {
    super(m);

    Object.setPrototypeOf(this, ExJWT.prototype);
  }

  get invalidJWT(): string {
    return this.JWT;
  }
}

