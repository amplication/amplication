import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PasswordService } from "./password.service";
// @ts-ignore
// eslint-disable-next-line
import { UserService } from "../user/user.service";
import { UserInfo } from "./UserInfo";
import { Credentials } from "./Credentials";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(
    username: string,
    password: string
  ): Promise<UserInfo | null> {
    const user = await this.userService.findOne({
      where: { username },
    });
    if (user && (await this.passwordService.compare(password, user.password))) {
      const { roles } = user;
      return { username, roles };
    }
    return null;
  }
  async login(credentials: Credentials): Promise<UserInfo> {
    const user = await this.validateUser(
      credentials.username,
      credentials.password
    );
    if (!user) {
      throw new UnauthorizedException("The passed credentials are incorrect");
    }
    const payload = { username: user.username };
    const accessToken = await this.jwtService.signAsync(payload); //signs username payload
    return {
      accessToken,
      ...user,
    };
  }
}
