import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import { UserService } from "./user.service";
import { UserControllerBase } from "./base/user.controller.base";

@swagger.ApiTags("users")
@common.Controller("users")
export class UserController extends UserControllerBase {
  constructor(protected readonly service: UserService) {
    super(service);
  }
}
