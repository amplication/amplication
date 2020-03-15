import { Resolver, Mutation, Args, ResolveProperty, Parent } from '@nestjs/graphql';

import { Auth } from '../models/auth';
import { LoginInput, SignupInput } from '../dto/inputs';
import { AuthService } from '../core';

@Resolver(of => Auth)
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  @Mutation(returns => Auth)
  async signup(@Args('data') data: SignupInput) {
    data.email = data.email.toLowerCase();
    const token = await this.auth.createAccount(data);
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

  @ResolveProperty('account')
  async account(@Parent() auth: Auth) {
    return await this.auth.getAccountFromToken(auth.token);
  }
}
