import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService, UserInfo } from "./auth/auth.service";
import { Credentials } from "./auth/Credentials";

@ApiTags("general")
@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}
  @Post("login")
  async login(@Body() body: Credentials): Promise<UserInfo | null> {
    return this.authService.validateUser(body.username, body.password);
  }
}
