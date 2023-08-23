import { Injectable } from "@nestjs/common";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { NovuService } from "./util/novuService";
import { novuPackage } from "./util/novuPackage";

const compose =
  (...fns) =>
  (x) =>
    fns.reduce((y, f) => f(y), x);

@Injectable()
export class AppService {
  constructor(
    private readonly logger: AmplicationLogger,
    private readonly novuService: NovuService
  ) {}
  notificationService(message: string): string {
    return compose(novuPackage)({
      message,
      novuService: this.novuService,
      amplicationLogger: this.logger,
      notifications: [],
    });
  }
}
