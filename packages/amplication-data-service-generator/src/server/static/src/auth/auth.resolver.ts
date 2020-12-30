import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { ApolloError } from "apollo-server-express";
import { AuthService } from "./auth.service";
import { UserInfo } from "./UserInfo";
import { LoginArgs } from "./LoginArgs";

@Resolver(UserInfo)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @Mutation(() => UserInfo)
  async login(@Args() args: LoginArgs): Promise<UserInfo> {
    const user = await this.authService.validateUser(
      args.credentials.username,
      args.credentials.password
    );
    if (!user) {
      throw new ApolloError("The passed credentials are incorrect");
    }
    return user;
  }
}
