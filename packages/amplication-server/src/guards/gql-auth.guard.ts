import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import get from 'lodash.get';
import { User } from '../models';
import {
  ResourceBasedAuthParams,
  ResourceBasedAuthParamType
} from '../decorators/resourceBasedAuthParams.dto';
import { PermissionsService } from '../core/permissions/permissions.service';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private permissionsService: PermissionsService
  ) {
    super();
  }

  /**
   * Returns whether the request is authorized to activate the handler
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check context with AuthGuard
    if (!(await super.canActivate(context))) {
      return false;
    }

    const ctx = GqlExecutionContext.create(context);
    const req = this.getRequest(context);
    const currentUser = req.user;
    const handler = context.getHandler();

    return (
      this.canActivateRoles(handler, currentUser) &&
      (await this.canActivateResource(handler, ctx, currentUser))
    );
  }

  // Checks if any of the required roles exist in the user role list
  private matchRoles(rolesToMatch: String[], userRoles: String[]): boolean {
    return rolesToMatch.some(r => userRoles.includes(r));
  }

  // This method is required for the interface - do not delete it.
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  private getExpectedRoles(handler: Function): string[] {
    return this.reflector.get<string[]>('roles', handler);
  }

  private canActivateRoles(handler: Function, currentUser: User): boolean {
    const expectedRoles = this.getExpectedRoles(handler);

    if (expectedRoles) {
      const currentUserRoles = currentUser.userRoles.map(r => r.role);
      return this.matchRoles(expectedRoles, currentUserRoles);
    }

    return true;
  }

  private getResourceBasedAuth(handler: Function): ResourceBasedAuthParams {
    return this.reflector.get<ResourceBasedAuthParams>(
      'resourceBasedAuth',
      handler
    );
  }

  private async canActivateResource(
    handler: Function,
    ctx: GqlExecutionContext,
    user: User
  ): Promise<boolean> {
    const resourceBasedAuth = this.getResourceBasedAuth(handler);

    if (!resourceBasedAuth) {
      return true;
    }

    const { param, type } = resourceBasedAuth;

    const requestArgs = ctx.getArgByIndex(1);
    const parameterValue = get(requestArgs, param);

    if (!parameterValue) {
      return false;
    }

    switch (type) {
      case ResourceBasedAuthParamType.OrganizationId: {
        return this.permissionsService.UserCanAccessOrganization(
          user,
          parameterValue
        );
      }
      case ResourceBasedAuthParamType.AppId: {
        return this.permissionsService.UserCanAccessApp(user, parameterValue);
      }
      default: {
        throw new Error(`Unexpected param type: ${type}`);
      }
    }
  }
}
