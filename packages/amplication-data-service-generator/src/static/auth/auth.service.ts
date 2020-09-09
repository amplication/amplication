import { Injectable } from "@nestjs/common";
import { UsersService, User } from "../users/users.service";

export type UserInfo = Omit<User, "password">;

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(
    username: string,
    password: string
  ): Promise<UserInfo | null> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
