import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Param,
  UseGuards,
  NotFoundException,
  Patch,
  Delete,
  UseInterceptors,
  ForbiddenException,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { MorganInterceptor } from "nest-morgan";
import {
  ACGuard,
  InjectRolesBuilder,
  RolesBuilder,
  UseRoles,
  UserRoles,
} from "nest-access-control";
// @ts-ignore
import { BasicAuthGuard } from "../auth/basicAuth.guard";
// @ts-ignore
import { getInvalidAttributes } from "../auth/abac.util";

declare interface CREATE_QUERY {}
declare interface UPDATE_QUERY {}
declare interface DELETE_QUERY {}

declare interface CREATE_INPUT {}
declare interface WHERE_INPUT {}
declare interface WHERE_UNIQUE_INPUT {}
declare interface UPDATE_INPUT {}

declare const FINE_ONE_PATH: string;
declare const UPDATE_PATH: string;
declare const DELETE_PATH: string;
declare interface FIND_ONE_QUERY {}

declare interface ENTITY {}
declare interface Select {}

declare interface SERVICE {
  create(args: { data: CREATE_INPUT; select: Select }): Promise<ENTITY>;
  findMany(args: { where: WHERE_INPUT; select: Select }): Promise<ENTITY[]>;
  findOne(args: {
    where: WHERE_UNIQUE_INPUT;
    select: Select;
  }): Promise<ENTITY | null>;
  update(args: {
    where: WHERE_UNIQUE_INPUT;
    data: UPDATE_INPUT;
    select: Select;
  }): Promise<ENTITY>;
  delete(args: { where: WHERE_UNIQUE_INPUT; select: Select }): Promise<ENTITY>;
}

declare const RESOURCE: string;
declare const ENTITY_NAME: string;
declare const CREATE_DATA_MAPPING: Object;
declare const UPDATE_DATA_MAPPING: Object;
declare const SELECT: Select;

@ApiTags(RESOURCE)
@Controller(RESOURCE)
export class CONTROLLER {
  constructor(
    private readonly service: SERVICE,
    @InjectRolesBuilder() private readonly rolesBuilder: RolesBuilder
  ) {}

  @UseInterceptors(MorganInterceptor("combined"))
  @UseGuards(BasicAuthGuard, ACGuard)
  @Post()
  @UseRoles({
    resource: ENTITY_NAME,
    action: "create",
    possession: "any",
  })
  create(
    @Query() query: CREATE_QUERY,
    @Body() data: CREATE_INPUT,
    @UserRoles() userRoles: string[]
  ): Promise<ENTITY> {
    const permission = this.rolesBuilder.permission({
      role: userRoles,
      action: "create",
      possession: "any",
      resource: ENTITY_NAME,
    });
    const invalidAttributes = getInvalidAttributes(permission, data);
    if (invalidAttributes.length) {
      const properties = invalidAttributes
        .map((attribute: string) => JSON.stringify(attribute))
        .join(", ");
      const roles = userRoles
        .map((role: string) => JSON.stringify(role))
        .join(",");
      throw new ForbiddenException(
        `providing the properties: ${properties} on ${ENTITY_NAME} creation is forbidden for roles: ${roles}`
      );
    }
    return this.service.create({
      ...query,
      data: CREATE_DATA_MAPPING,
      select: SELECT,
    });
  }

  @UseInterceptors(MorganInterceptor("combined"))
  @UseGuards(BasicAuthGuard, ACGuard)
  @Get()
  @UseRoles({
    resource: ENTITY_NAME,
    action: "read",
    possession: "any",
  })
  async findMany(
    @Query() query: WHERE_INPUT,
    @UserRoles() userRoles: string[]
  ): Promise<ENTITY[]> {
    const permission = this.rolesBuilder.permission({
      role: userRoles,
      action: "read",
      possession: "any",
      resource: ENTITY_NAME,
    });
    const results = await this.service.findMany({
      where: query,
      select: SELECT,
    });
    return results.map((result) => permission.filter(result));
  }

  @UseInterceptors(MorganInterceptor("combined"))
  @UseGuards(BasicAuthGuard, ACGuard)
  @Get(FINE_ONE_PATH)
  @UseRoles({
    resource: ENTITY_NAME,
    action: "read",
    possession: "own",
  })
  async findOne(
    @Query() query: FIND_ONE_QUERY,
    @Param() params: WHERE_UNIQUE_INPUT,
    @UserRoles() userRoles: string[]
  ): Promise<ENTITY | null> {
    const permission = this.rolesBuilder.permission({
      role: userRoles,
      action: "read",
      possession: "own",
      resource: ENTITY_NAME,
    });
    const result = await this.service.findOne({
      ...query,
      where: params,
      select: SELECT,
    });
    if (result === null) {
      throw new NotFoundException(
        `No resource was found for ${JSON.stringify(params)}`
      );
    }
    return permission.filter(result);
  }

  @UseInterceptors(MorganInterceptor("combined"))
  @UseGuards(BasicAuthGuard, ACGuard)
  @Patch(UPDATE_PATH)
  @UseRoles({
    resource: ENTITY_NAME,
    action: "update",
    possession: "any",
  })
  async update(
    @Query() query: UPDATE_QUERY,
    @Param() params: WHERE_UNIQUE_INPUT,
    @Body()
    data: UPDATE_INPUT,
    @UserRoles() userRoles: string[]
  ): Promise<ENTITY | null> {
    const permission = this.rolesBuilder.permission({
      role: userRoles,
      action: "update",
      possession: "any",
      resource: ENTITY_NAME,
    });
    const invalidAttributes = getInvalidAttributes(permission, data);
    if (invalidAttributes.length) {
      const properties = invalidAttributes
        .map((attribute: string) => JSON.stringify(attribute))
        .join(", ");
      const roles = userRoles
        .map((role: string) => JSON.stringify(role))
        .join(",");
      throw new ForbiddenException(
        `providing the properties: ${properties} on ${ENTITY_NAME} update is forbidden for roles: ${roles}`
      );
    }
    return this.service.update({
      ...query,
      where: params,
      data: UPDATE_DATA_MAPPING,
      select: SELECT,
    });
  }

  @UseInterceptors(MorganInterceptor("combined"))
  @UseGuards(BasicAuthGuard, ACGuard)
  @Delete(DELETE_PATH)
  @UseRoles({
    resource: ENTITY_NAME,
    action: "delete",
    possession: "any",
  })
  async delete(
    @Query() query: DELETE_QUERY,
    @Param() params: WHERE_UNIQUE_INPUT
  ): Promise<ENTITY | null> {
    return this.service.delete({ ...query, where: params, select: SELECT });
  }
}
