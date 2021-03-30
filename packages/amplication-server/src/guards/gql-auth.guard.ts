import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import get from 'lodash.get';
import { User } from 'src/models';
import { PermissionsService } from 'src/core/permissions/permissions.service';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';

export const AUTHORIZE_CONTEXT = 'authorizeContext';

export type AuthorizeContextParameters = {
  parameterType: AuthorizableResourceParameter;
  parameterPath: string;
};

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

    const requestArgs = ctx.getArgByIndex(1);

    return (
      this.canActivateRoles(handler, currentUser) &&
      (await this.authorizeContext(handler, requestArgs, currentUser))
    );
  }

  // Checks if any of the required roles exist in the user role list
  private matchRoles(rolesToMatch: string[], userRoles: string[]): boolean {
    return rolesToMatch.some(r => userRoles.includes(r));
  }

  // This method is required for the interface - do not delete it.
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  /* eslint-disable-next-line @typescript-eslint/ban-types */
  private getExpectedRoles(handler: Function): string[] {
    return this.reflector.get<string[]>('roles', handler);
  }

  /* eslint-disable-next-line @typescript-eslint/ban-types */
  canActivateRoles(handler: Function, currentUser: User): boolean {
    const expectedRoles = this.getExpectedRoles(handler);

    if (expectedRoles) {
      const currentUserRoles = currentUser.userRoles.map(r => r.role);
      return this.matchRoles(expectedRoles, currentUserRoles);
    }

    return true;
  }

  /* eslint-disable-next-line @typescript-eslint/ban-types */
  private getAuthorizeContextParameters(handler: Function) {
    return this.reflector.get<AuthorizeContextParameters>(
      AUTHORIZE_CONTEXT,
      handler
    );
  }

  authorizeContext(
    /* eslint-disable-next-line @typescript-eslint/ban-types */
    handler: Function,
    requestArgs: any,
    user: User
  ): Promise<boolean> {
    const parameters = this.getAuthorizeContextParameters(handler);

    if (!parameters) {
      return Promise.resolve(true);
    }

    const { parameterType, parameterPath } = parameters;

    const parameterValue = get(requestArgs, parameterPath);

    if (!parameterValue) {
      return Promise.resolve(false);
    }

    return this.permissionsService.validateAccess(
      user,
      parameterType,
      parameterValue
    );
  }
}
