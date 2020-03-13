import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User} from '../models'

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super()
  }

  async canActivate(context: ExecutionContext) {
    if (!await super.canActivate(context)) {
      return false;
    }
    
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = this.getRequest(context);
    const user :User = request.user;
    
    return this.matchRoles(roles, user.userRoles.map(r=>r.role));

    
  }

  matchRoles(rolesToMatch : String[], userRoles: String[]): boolean{
    return rolesToMatch.some( r=> userRoles.includes(r));

  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
