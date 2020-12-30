import { Controller, Post, Body, UnauthorizedException } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { UserInfo } from "./UserInfo";
import { Credentials } from "./Credentials";

@ApiTags("auth")
@Controller()
export class AuthController {
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
