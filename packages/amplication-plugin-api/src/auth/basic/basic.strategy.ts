import { Injectable } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { BasicStrategyBase } from "./base/basic.strategy.base";

@Injectable()
export class BasicStrategy extends BasicStrategyBase {
  constructor(protected readonly authService: AuthService) {
    super(authService);
  }
}
