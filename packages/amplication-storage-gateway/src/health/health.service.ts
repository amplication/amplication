import { Injectable } from "@nestjs/common";
import { HealthServiceBase } from "./base/health.service.base";

@Injectable()
export class HealthService extends HealthServiceBase {
  constructor() {
    super();
  }
}
