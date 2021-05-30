import * as common from "@nestjs/common";
import * as gqlBasicAuthGuard from "../auth/gqlBasicAuth.guard";
import * as gqlACGuard from "../auth/gqlAC.guard";
import { Args, Mutation, Resolver, Query } from "@nestjs/graphql";
import { ApolloError } from "apollo-server-express";
import { AuthService } from "./auth.service";
import { UserInfo } from "./UserInfo";
import { LoginArgs } from "./LoginArgs";
import { UserData } from "./gqlUserData.decorator";

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

  @Query(() => UserInfo)
  @common.UseGuards(gqlBasicAuthGuard.GqlBasicAuthGuard, gqlACGuard.GqlACGuard)
  async userInfo(@UserData() userInfo: UserInfo): Promise<UserInfo> {
    return userInfo;
  }
}
