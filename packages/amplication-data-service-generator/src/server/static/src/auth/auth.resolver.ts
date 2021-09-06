import { GqlDefaultAuthGuard } from "./gqlDefaultAuth.guard";
import * as common from "@nestjs/common";
import * as gqlACGuard from "../auth/gqlAC.guard";
import { Args, Mutation, Resolver, Query } from "@nestjs/graphql";
import { ApolloError } from "apollo-server-express";
import { AuthService } from "./auth.service";
import { UserInfo } from "./UserInfo";
import { LoginArgs } from "./LoginArgs";
import { UserData } from "./gqlUserData.decorator";
import { JwtService } from "@nestjs/jwt";

@Resolver(UserInfo)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService
  ) {}
  @Mutation(() => UserInfo)
  async login(@Args() args: LoginArgs): Promise<UserInfo> {
    const user = await this.authService.validateUser(
      args.credentials.username,
      args.credentials.password
    );
    if (!user) {
      throw new ApolloError("The passed credentials are incorrect");
    }
    const payload = { username: user.username };
    return {
      accessToken: this.jwtService.sign(payload), //signs username payload
      ...user,
    };
  }

  @Query(() => UserInfo)
  @common.UseGuards(GqlDefaultAuthGuard, gqlACGuard.GqlACGuard)
  async userInfo(@UserData() userInfo: UserInfo): Promise<UserInfo> {
    return userInfo;
  }
}
