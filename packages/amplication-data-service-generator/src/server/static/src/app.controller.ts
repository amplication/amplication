import { Controller, Post, Body, UnauthorizedException } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService, UserInfo } from "./auth/auth.service";
import { Credentials } from "./auth/Credentials";

@ApiTags("general")
@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}
  @Post("login")
  async login(@Body() body: Credentials): Promise<UserInfo> {
    const user = await this.authService.validateUser(
      body.username,
      body.password
    );
    if (!user) {
      throw new UnauthorizedException("The passed credentials are incorrect");
    }
    return user;
  }
}
