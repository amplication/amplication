import { Injectable } from "@nestjs/common";
import { PasswordService } from "./password.service";
// @ts-ignore
// eslint-disable-next-line
import { UserService, User } from "../user/user.service";

export type UserInfo = Omit<User, "password">;

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService
  ) {}

  async validateUser(
    username: string,
    password: string
  ): Promise<UserInfo | null> {
    const user = await this.userService.findOne({
      where: { username },
    });
    if (user && (await this.passwordService.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
