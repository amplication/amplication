import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards, UseFilters } from '@nestjs/common';
import { Auth, User } from '../models';
import { LoginInput, SignupInput, WhereUniqueInput } from '../dto/inputs';
import { AuthService } from '../core';
import { GqlResolverExceptionsFilter } from '../filters/GqlResolverExceptions.filter';
import { UserEntity } from '../decorators/user.decorator';
import { GqlAuthGuard } from '../guards/gql-auth.guard';

@Resolver(of => Auth)
@UseFilters(GqlResolverExceptionsFilter)
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  @Mutation(returns => Auth)
  async signup(@Args('data') data: SignupInput) {
    data.email = data.email.toLowerCase();
    const token = await this.auth.signup(data);
    return {
      token
    };
  }

  @Mutation(returns => Auth)
  async login(@Args('data') { email, password }: LoginInput) {
    const token = await this.auth.login(email.toLowerCase(), password);
    return {
      token
    };
  }

  @Mutation(returns => Auth)
  @UseGuards(GqlAuthGuard)
  async setCurrentOrganization(
    @UserEntity() user: User,
    @Args('data') organizationData: WhereUniqueInput
  ) {
    const token = await this.auth.setCurrentOrganization(
      user.account.id,
      organizationData.id
    );
    return {
      token
    };
  }
}
