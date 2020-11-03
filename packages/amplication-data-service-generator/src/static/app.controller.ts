import { Controller, Request, Post, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { BasicAuthGuard } from "./auth/basicAuth.guard";
import { UserInfo } from "./auth/auth.service";

@ApiTags("general")
@Controller()
export class AppController {
  @UseGuards(BasicAuthGuard)
  @Post("login")
  async login(@Request() req: { user: UserInfo }): Promise<UserInfo> {
    return req.user;
  }
}
