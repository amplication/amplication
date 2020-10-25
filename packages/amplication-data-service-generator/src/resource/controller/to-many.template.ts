import {
  Body,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { RolesBuilder, UseRoles, UserRoles } from "nest-access-control";
// @ts-ignore
import { getInvalidAttributes } from "../auth/abac.util";

declare interface WHERE_UNIQUE_INPUT {}
declare interface RELATIONSHIP_WHERE_UNIQUE_INPUT {}
declare interface RELATIONSHIP_WHERE_INPUT {}
declare interface Select {}

declare interface RELATIONSHIP {}

declare interface SERVICE {
  findOne(args: {
    where: WHERE_UNIQUE_INPUT;
  }): {
    PROPERTY(args: {
      where: RELATIONSHIP_WHERE_INPUT;
      select: Select;
    }): Promise<RELATIONSHIP[]>;
  };
  update(args: {
    where: WHERE_UNIQUE_INPUT;
    data: {
      PROPERTY: {
        set?: RELATIONSHIP_WHERE_UNIQUE_INPUT[];
        connect?: RELATIONSHIP_WHERE_UNIQUE_INPUT[];
        disconnect?: RELATIONSHIP_WHERE_UNIQUE_INPUT[];
      };
    };
  }): {
    PROPERTY(args?: { select: Select }): Promise<RELATIONSHIP[]>;
  };
}

declare const ENTITY_NAME: string;
declare const RELATIONSHIP_NAME: string;
declare const FIND_MANY_PATH: string;
declare const CREATE_PATH: string;
declare const DELETE_PATH: string;
declare const UPDATE_PATH: string;
declare const SELECT: Select;

export class Mixin {
  constructor(
    private readonly service: SERVICE,
    private readonly rolesBuilder: RolesBuilder
  ) {}
  @Get(FIND_MANY_PATH)
  @UseRoles({
    resource: ENTITY_NAME,
    action: "read",
    possession: "any",
  })
  async findMany(
    @Param() params: WHERE_UNIQUE_INPUT,
    @Query() query: RELATIONSHIP_WHERE_INPUT,
    @UserRoles() userRoles: string[]
  ): Promise<RELATIONSHIP[]> {
    const permission = this.rolesBuilder.permission({
      role: userRoles,
      action: "read",
      possession: "any",
      resource: RELATIONSHIP_NAME,
    });
    const results = await this.service
      .findOne({ where: params })
      .PROPERTY({ where: query, select: SELECT });
    return results.map((result) => permission.filter(result));
  }
  @Post(CREATE_PATH)
  @UseRoles({
    resource: ENTITY_NAME,
    action: "update",
    possession: "any",
  })
  async create(
    @Param() params: WHERE_UNIQUE_INPUT,
    @Body() body: WHERE_UNIQUE_INPUT[],
    @UserRoles() userRoles: string[]
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
    const invalidAttributes = getInvalidAttributes(permission, data);
    if (invalidAttributes.length) {
      const roles = userRoles
        .map((role: string) => JSON.stringify(role))
        .join(",");
      throw new ForbiddenException(
        `Updating the relationship: ${invalidAttributes[0]} of ${ENTITY_NAME} is forbidden for roles: ${roles}`
      );
    }
    await this.service
      .update({
        where: params,
        data,
      })
      .PROPERTY();
  }
  @Patch(UPDATE_PATH)
  @UseRoles({
    resource: ENTITY_NAME,
    action: "update",
    possession: "any",
  })
  async update(
    @Param() params: WHERE_UNIQUE_INPUT,
    @Body() body: WHERE_UNIQUE_INPUT[],
    @UserRoles() userRoles: string[]
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
    const invalidAttributes = getInvalidAttributes(permission, data);
    if (invalidAttributes.length) {
      const roles = userRoles
        .map((role: string) => JSON.stringify(role))
        .join(",");
      throw new ForbiddenException(
        `Updating the relationship: ${invalidAttributes[0]} of ${ENTITY_NAME} is forbidden for roles: ${roles}`
      );
    }
    await this.service
      .update({
        where: params,
        data,
      })
      .PROPERTY();
  }
  @Delete(DELETE_PATH)
  @UseRoles({
    resource: ENTITY_NAME,
    action: "update",
    possession: "any",
  })
  async delete(
    @Param() params: WHERE_UNIQUE_INPUT,
    @Body() body: WHERE_UNIQUE_INPUT[],
    @UserRoles() userRoles: string[]
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
    const invalidAttributes = getInvalidAttributes(permission, data);
    if (invalidAttributes.length) {
      const roles = userRoles
        .map((role: string) => JSON.stringify(role))
        .join(",");
      throw new ForbiddenException(
        `Updating the relationship: ${invalidAttributes[0]} of ${ENTITY_NAME} is forbidden for roles: ${roles}`
      );
    }
    await this.service
      .update({
        where: params,
        data,
      })
      .PROPERTY();
  }
}
