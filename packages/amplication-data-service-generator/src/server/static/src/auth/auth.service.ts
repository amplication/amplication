import { Injectable } from "@nestjs/common";
import { PasswordService } from "./password.service";
// @ts-ignore
// eslint-disable-next-line
import { UserService } from "../user/user.service";
// @ts-ignore
// eslint-disable-next-line
import { User } from "../user/user";

export type UserInfo = Pick<User, "username" | "roles">;

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
      const { roles } = user;
      return { username, roles };
    }
    return null;
  }
}
