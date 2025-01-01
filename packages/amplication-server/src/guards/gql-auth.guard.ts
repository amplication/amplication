import { Injectable, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { GqlExecutionContext } from "@nestjs/graphql";
import { get } from "lodash";
import { PermissionsService } from "../core/permissions/permissions.service";
import { AuthorizableOriginParameter } from "../enums/AuthorizableOriginParameter";
import { AuthUser } from "../core/auth/types";
import { RolesPermissions } from "@amplication/util-roles-types";

export const AUTHORIZE_CONTEXT = "authorizeContext";

export type AuthorizeContextParameters = {
  parameterType: AuthorizableOriginParameter;
  parameterPath: string;
  requiredPermissions?: RolesPermissions[];
};

@Injectable()
export class GqlAuthGuard extends AuthGuard("jwt") {
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
      this.canPerformTask(handler, currentUser) &&
      (await this.authorizeContext(handler, requestArgs, currentUser))
    );
  }

  // Checks if any of the required roles exist in the user role list
  private matchPermissions(
    permissionsToMatch: string[],
    userPermissions: string[]
  ): boolean {
    return (
      userPermissions.includes("*") ||
      permissionsToMatch.some((r) => userPermissions.includes(r))
    );
  }

  // This method is required for the interface - do not delete it.
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  /* eslint-disable-next-line @typescript-eslint/ban-types */
  private getRequiredPermissions(handler: Function): string[] {
    return this.reflector.get<string[]>("permissions", handler);
  }

  /* eslint-disable-next-line @typescript-eslint/ban-types */
  canPerformTask(handler: Function, currentUser: AuthUser): boolean {
    const requiredPermissions = this.getRequiredPermissions(handler);

    if (requiredPermissions) {
      const currentUserPermissions = currentUser.permissions;
      return this.matchPermissions(requiredPermissions, currentUserPermissions);
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
    user: AuthUser
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
