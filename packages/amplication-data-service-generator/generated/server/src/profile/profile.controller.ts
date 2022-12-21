import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import { ProfileService } from "./profile.service";
import { ProfileControllerBase } from "./base/profile.controller.base";

@swagger.ApiTags("profiles")
@common.Controller("profiles")
export class ProfileController extends ProfileControllerBase {
  constructor(protected readonly service: ProfileService) {
    super(service);
  }
}
