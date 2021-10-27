// @ts-ignore
import { Injectable } from "@nestjs/common";
// @ts-ignore
import { ITokenService } from "./ITokenService";

declare class SELECTED_TOKEN_SERVICE implements ITokenService {}

@Injectable()
export class DefaultTokenService
  extends SELECTED_TOKEN_SERVICE
  implements ITokenService {}
