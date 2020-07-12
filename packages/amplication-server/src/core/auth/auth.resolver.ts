import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards, UseFilters } from '@nestjs/common';
import { Auth, User, Account } from 'src/models';
import { LoginInput, SignupInput, ChangePasswordInput } from './dto';
import { WhereUniqueInput } from 'src/dto';

import { AuthService } from './auth.service';
import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';
import { UserEntity } from 'src/decorators/user.decorator';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';

@Resolver(() => Auth)
@UseFilters(GqlResolverExceptionsFilter)
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  @Mutation(() => Auth)
  async signup(@Args('data') data: SignupInput) {
    data.email = data.email.toLowerCase();
    const token = await this.auth.signup(data);
    return {
      token
    };
  }

  @Mutation(() => Auth)
  async login(@Args('data') { email, password }: LoginInput) {
    const token = await this.auth.login(email.toLowerCase(), password);
    return {
      token
    };
  }

  @Mutation(() => Account)
  async changePassword(
    @UserEntity() account: Account,
    @Args('data') changePassword: ChangePasswordInput
  ) {
    return this.auth.changePassword(
      account.id,
      account.password,
      changePassword
    );
  }

  @Mutation(() => Auth)
  @UseGuards(GqlAuthGuard)
  async setCurrentOrganization(
    @UserEntity() user: User,
    @Args('data') organizationData: WhereUniqueInput
  ) {
    if (!user.account) {
      throw new Error('User has no account');
    }
    const token = await this.auth.setCurrentOrganization(
      user.account.id,
      organizationData.id
    );
    return {
      token
    };
  }
}
