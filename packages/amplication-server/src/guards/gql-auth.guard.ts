import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import get from 'lodash.get';
import set from 'lodash.set';
import { User } from 'src/models';
import { PermissionsService } from 'src/core/permissions/permissions.service';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';
import { InjectableResourceParameter } from 'src/enums/InjectableResourceParameter';

export const AUTHORIZE_CONTEXT = 'authorizeContext';
export const INJECT_CONTEXT_VALUE = 'injectContextValue';

export type AuthorizeContextParameters = {
  parameterType: AuthorizableResourceParameter;
  parameterPath: string;
};

export type InjectContextValueParameters = {
  parameterType: InjectableResourceParameter;
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

    this.injectContextValue(handler, requestArgs, currentUser);

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

  private getExpectedRoles(handler: Function): string[] {
    return this.reflector.get<string[]>('roles', handler);
  }

  canActivateRoles(handler: Function, currentUser: User): boolean {
    const expectedRoles = this.getExpectedRoles(handler);

    if (expectedRoles) {
      const currentUserRoles = currentUser.userRoles.map(r => r.role);
      return this.matchRoles(expectedRoles, currentUserRoles);
    }

    return true;
  }

  private getAuthorizeContextParameters(handler: Function) {
    return this.reflector.get<AuthorizeContextParameters>(
      AUTHORIZE_CONTEXT,
      handler
    );
  }

  async authorizeContext(
    handler: Function,
    requestArgs: any,
    user: User
  ): Promise<boolean> {
    const parameters = this.getAuthorizeContextParameters(handler);

    if (!parameters) {
      return true;
    }

    const { parameterType, parameterPath } = parameters;

    const parameterValue = get(requestArgs, parameterPath);

    if (!parameterValue) {
      return false;
    }

    return this.permissionsService.validateAccess(
      user,
      parameterType,
      parameterValue
    );
  }

  private getInjectContextValueParameters(handler: Function) {
    return this.reflector.get<InjectContextValueParameters>(
      INJECT_CONTEXT_VALUE,
      handler
    );
  }

  private getInjectableContextValue(
    user: User,
    parameterType: InjectableResourceParameter
  ): string {
    switch (parameterType) {
      case InjectableResourceParameter.UserId: {
        return user.id;
      }
      case InjectableResourceParameter.OrganizationId: {
        return user.organization?.id;
      }
      default: {
        throw new Error(`Unexpected parameterType: ${parameterType}`);
      }
    }
  }

  injectContextValue(handler: Function, requestArgs: any, user: User) {
    const parameters = this.getInjectContextValueParameters(handler);

    if (!parameters) {
      return;
    }

    const { parameterType, parameterPath } = parameters;
    const parameterValue = this.getInjectableContextValue(user, parameterType);

    set(requestArgs, parameterPath, parameterValue);
  }
}
