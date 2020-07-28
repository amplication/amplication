import { Controller, Request, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UserInfo } from "./auth/auth.service";

@Controller()
export class AppController {
  @UseGuards(AuthGuard("basic"))
  @Post("login")
  async login(@Request() req: { user: UserInfo }) {
    return req.user;
  }
}
