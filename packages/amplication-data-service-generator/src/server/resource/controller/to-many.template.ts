import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import * as nestMorgan from "nest-morgan";
import * as nestAccessControl from "nest-access-control";
// @ts-ignore
import * as defaultAuthGuard from "../auth/defaultAuth.guard";
// @ts-ignore
import * as abacUtil from "../auth/abac.util";
import { Request } from "express";
// @ts-ignore
import { ApiNestedQuery } from "../../decorators/api-nested-query.decorator";
import { plainToClass } from "class-transformer";
// @ts-ignore
import * as errors from "../../errors";

declare interface WHERE_UNIQUE_INPUT {
  id: string;
}
declare interface RELATED_ENTITY_WHERE_UNIQUE_INPUT {}
declare class RELATED_ENTITY_WHERE_INPUT {}
declare interface Select {}

declare interface RELATED_ENTITY {}

declare class RELATED_ENTITY_FIND_MANY_ARGS {}

declare interface SERVICE {
  FIND_PROPERTY(
    parentId: string,
    args: RELATED_ENTITY_WHERE_INPUT
  ): Promise<RELATED_ENTITY[]>;

  update(args: {
    where: WHERE_UNIQUE_INPUT;
    data: {
      PROPERTY: {
        set?: RELATED_ENTITY_WHERE_UNIQUE_INPUT[];
        connect?: RELATED_ENTITY_WHERE_UNIQUE_INPUT[];
        disconnect?: RELATED_ENTITY_WHERE_UNIQUE_INPUT[];
      };
    };
    select: { id: true };
  }): Promise<void>;
}

declare const ENTITY_NAME: string;
declare const RELATED_ENTITY_NAME: string;
declare const FIND_MANY_PATH: string;
declare const CREATE_PATH: string;
declare const DELETE_PATH: string;
declare const UPDATE_PATH: string;
declare const SELECT: Select;

export class Mixin {
  constructor(
    private readonly service: SERVICE,
    private readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {}

  @common.UseInterceptors(nestMorgan.MorganInterceptor("combined"))
  @common.UseGuards(
    defaultAuthGuard.DefaultAuthGuard,
    nestAccessControl.ACGuard
  )
  @common.Get(FIND_MANY_PATH)
  @nestAccessControl.UseRoles({
    resource: ENTITY_NAME,
    action: "read",
    possession: "any",
  })
  @ApiNestedQuery(RELATED_ENTITY_FIND_MANY_ARGS)
  async FIND_MANY(
    @common.Req() request: Request,
    @common.Param() params: WHERE_UNIQUE_INPUT,
    @nestAccessControl.UserRoles() userRoles: string[]
  ): Promise<RELATED_ENTITY[]> {
    const query = plainToClass(RELATED_ENTITY_FIND_MANY_ARGS, request.query);
    const permission = this.rolesBuilder.permission({
      role: userRoles,
      action: "read",
      possession: "any",
      resource: RELATED_ENTITY_NAME,
    });
    const results = await this.service.FIND_PROPERTY(params.id, {
      ...query,
      select: SELECT,
    });
    if (results === null) {
      throw new errors.NotFoundException(
        `No resource was found for ${JSON.stringify(params)}`
      );
    }
    return results.map((result) => permission.filter(result));
  }

  @common.UseInterceptors(nestMorgan.MorganInterceptor("combined"))
  @common.UseGuards(
    defaultAuthGuard.DefaultAuthGuard,
    nestAccessControl.ACGuard
  )
  @common.Post(CREATE_PATH)
  @nestAccessControl.UseRoles({
    resource: ENTITY_NAME,
    action: "update",
    possession: "any",
  })
  async CREATE(
    @common.Param() params: WHERE_UNIQUE_INPUT,
    @common.Body() body: WHERE_UNIQUE_INPUT[],
    @nestAccessControl.UserRoles() userRoles: string[]
  ): Promise<void> {
    const data = {
      PROPERTY: {
        connect: body,
      },
    };
    const permission = this.rolesBuilder.permission({
      role: userRoles,
      action: "update",
      possession: "any",
      resource: ENTITY_NAME,
    });
    const invalidAttributes = abacUtil.getInvalidAttributes(permission, data);
    if (invalidAttributes.length) {
      const roles = userRoles
        .map((role: string) => JSON.stringify(role))
        .join(",");
      throw new common.ForbiddenException(
        `Updating the relationship: ${invalidAttributes[0]} of ${ENTITY_NAME} is forbidden for roles: ${roles}`
      );
    }
    await this.service.update({
      where: params,
      data,
      select: { id: true },
    });
  }

  @common.UseInterceptors(nestMorgan.MorganInterceptor("combined"))
  @common.UseGuards(
    defaultAuthGuard.DefaultAuthGuard,
    nestAccessControl.ACGuard
  )
  @common.Patch(UPDATE_PATH)
  @nestAccessControl.UseRoles({
    resource: ENTITY_NAME,
    action: "update",
    possession: "any",
  })
  async UPDATE(
    @common.Param() params: WHERE_UNIQUE_INPUT,
    @common.Body() body: WHERE_UNIQUE_INPUT[],
    @nestAccessControl.UserRoles() userRoles: string[]
  ): Promise<void> {
    const data = {
      PROPERTY: {
        set: body,
      },
    };
    const permission = this.rolesBuilder.permission({
      role: userRoles,
      action: "update",
      possession: "any",
      resource: ENTITY_NAME,
    });
    const invalidAttributes = abacUtil.getInvalidAttributes(permission, data);
    if (invalidAttributes.length) {
      const roles = userRoles
        .map((role: string) => JSON.stringify(role))
        .join(",");
      throw new common.ForbiddenException(
        `Updating the relationship: ${invalidAttributes[0]} of ${ENTITY_NAME} is forbidden for roles: ${roles}`
      );
    }
    await this.service.update({
      where: params,
      data,
      select: { id: true },
    });
  }

  @common.UseInterceptors(nestMorgan.MorganInterceptor("combined"))
  @common.UseGuards(
    defaultAuthGuard.DefaultAuthGuard,
    nestAccessControl.ACGuard
  )
  @common.Delete(DELETE_PATH)
  @nestAccessControl.UseRoles({
    resource: ENTITY_NAME,
    action: "update",
    possession: "any",
  })
  async DELETE(
    @common.Param() params: WHERE_UNIQUE_INPUT,
    @common.Body() body: WHERE_UNIQUE_INPUT[],
    @nestAccessControl.UserRoles() userRoles: string[]
  ): Promise<void> {
    const data = {
      PROPERTY: {
        disconnect: body,
      },
    };
    const permission = this.rolesBuilder.permission({
      role: userRoles,
      action: "update",
      possession: "any",
      resource: ENTITY_NAME,
    });
    const invalidAttributes = abacUtil.getInvalidAttributes(permission, data);
    if (invalidAttributes.length) {
      const roles = userRoles
        .map((role: string) => JSON.stringify(role))
        .join(",");
      throw new common.ForbiddenException(
        `Updating the relationship: ${invalidAttributes[0]} of ${ENTITY_NAME} is forbidden for roles: ${roles}`
      );
    }
    await this.service.update({
      where: params,
      data,
      select: { id: true },
    });
  }
}
