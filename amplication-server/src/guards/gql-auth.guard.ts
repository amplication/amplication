import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '../models';
import { ResourceBasedAuthParams } from '../decorators/resourceBasedAuthParams.dto';
import { PermissionsService } from '../core/permissions/permissions.service';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private permissionsService: PermissionsService
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    if (!(await super.canActivate(context))) {
      return false;
    }

    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const currentUser: User = request.user;

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (roles) {
      if (
        !this.matchRoles(
          roles,
          currentUser.userRoles.map(r => r.role)
        )
      ) {
        return false;
      }
    }

    const resourceBasedAuth = this.reflector.get<ResourceBasedAuthParams>(
      'resourceBasedAuth',
      context.getHandler()
    );
    if (!resourceBasedAuth) {
      return true;
    }

    const { param, applyFromContext, type } = resourceBasedAuth;
    if (!param) {
      return true;
    }

    const requestArgs = ctx.getArgByIndex(1);

    const val = param.split('.').reduce((current, prop, i, arr) => {
      if (!current[prop]) {
        if (applyFromContext) {
          current[prop] = {};
        } else {
          arr.splice(1); // eject early
        }
      }

      if (applyFromContext && i == arr.length - 1) {
        current[prop] = currentUser.organization.id;
      }
      return current[prop];
    }, requestArgs);

    return (
      applyFromContext ||
      this.validateResourceBasedAuthorization(type, val, currentUser)
    );
  }

  //validates if the user have permissions to access the requested object
  async validateResourceBasedAuthorization(
    parameterType: string,
    parameterValue: string,
    user: User
  ): Promise<boolean> {
    switch (parameterType) {
      case 'organizationId': {
        return this.permissionsService.UserCanAccessOrganization(
          user,
          parameterValue
        );
        break;
      }
      case 'appId': {
        return this.permissionsService.UserCanAccessApp(
          user,
          parameterValue
        );
        break;
      }
      default: {
        return false;
        break;
      }
    }
  }

  //checks if any of the required roles exist in the user role list
  matchRoles(rolesToMatch: String[], userRoles: String[]): boolean {
    return rolesToMatch.some(r => userRoles.includes(r));
  }

  //This method is requird for the interface - do not delete it.
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
