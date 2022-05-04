import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import * as nestAccessControl from "nest-access-control";
// @ts-ignore
import * as defaultAuthGuard from "../../auth/defaultAuth.guard";
// @ts-ignore
import * as abacUtil from "../../auth/abac.util";
// @ts-ignore
import { isRecordNotFoundError } from "../../prisma.util";
// @ts-ignore
import * as errors from "../../errors";
import { Request } from "express";
import { plainToClass } from "class-transformer";
// @ts-ignore
import { ApiNestedQuery } from "../../decorators/api-nested-query.decorator";
// @ts-ignore
import { Public } from "../../decorators/public.decorator";
// @ts-ignore
import { AclValidateRequestInterceptor } from "../../interceptors/aclValidateRequest.interceptor";
// @ts-ignore
import { AclFilterResponseInterceptor } from "../../interceptors/aclFilterResponse.interceptor";

declare interface CREATE_INPUT {}
declare interface WHERE_INPUT {}
declare interface WHERE_UNIQUE_INPUT {}
declare class FIND_MANY_ARGS {
  where: WHERE_INPUT;
}
declare interface UPDATE_INPUT {}

declare const FINE_ONE_PATH: string;
declare const UPDATE_PATH: string;
declare const DELETE_PATH: string;

declare class ENTITY {}
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
declare const CREATE_DATA_MAPPING: CREATE_INPUT;
declare const UPDATE_DATA_MAPPING: UPDATE_INPUT;
declare const SELECT: Select;

//@ts-ignore
@swagger.SWAGGER_API_AUTH_FUNCTION()
@common.UseGuards(defaultAuthGuard.DefaultAuthGuard, nestAccessControl.ACGuard)
export class CONTROLLER_BASE {
  constructor(
    protected readonly service: SERVICE,
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {}

  @common.UseInterceptors(AclValidateRequestInterceptor)
  @nestAccessControl.UseRoles({
    resource: ENTITY_NAME,
    action: "create",
    possession: "any",
  })
  @common.Post()
  @swagger.ApiCreatedResponse({ type: ENTITY })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async CREATE_ENTITY_FUNCTION(
    @common.Body() data: CREATE_INPUT
  ): Promise<ENTITY> {
    return await this.service.create({
      data: CREATE_DATA_MAPPING,
      select: SELECT,
    });
  }

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @nestAccessControl.UseRoles({
    resource: ENTITY_NAME,
    action: "read",
    possession: "any",
  })
  @common.Get()
  @swagger.ApiOkResponse({ type: [ENTITY] })
  @swagger.ApiForbiddenResponse()
  @ApiNestedQuery(FIND_MANY_ARGS)
  async FIND_MANY_ENTITY_FUNCTION(
    @common.Req() request: Request
  ): Promise<ENTITY[]> {
    const args = plainToClass(FIND_MANY_ARGS, request.query);
    return this.service.findMany({
      ...args,
      select: SELECT,
    });
  }

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @nestAccessControl.UseRoles({
    resource: ENTITY_NAME,
    action: "read",
    possession: "own",
  })
  @common.Get(FINE_ONE_PATH)
  @swagger.ApiOkResponse({ type: ENTITY })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async FIND_ONE_ENTITY_FUNCTION(
    @common.Param() params: WHERE_UNIQUE_INPUT
  ): Promise<ENTITY | null> {
    const result = await this.service.findOne({
      where: params,
      select: SELECT,
    });
    if (result === null) {
      throw new errors.NotFoundException(
        `No resource was found for ${JSON.stringify(params)}`
      );
    }
    return result;
  }

  @common.UseInterceptors(AclValidateRequestInterceptor)
  @nestAccessControl.UseRoles({
    resource: ENTITY_NAME,
    action: "update",
    possession: "any",
  })
  @common.Patch(UPDATE_PATH)
  @swagger.ApiOkResponse({ type: ENTITY })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async UPDATE_ENTITY_FUNCTION(
    @common.Param() params: WHERE_UNIQUE_INPUT,
    @common.Body() data: UPDATE_INPUT
  ): Promise<ENTITY | null> {
    try {
      return await this.service.update({
        where: params,
        data: UPDATE_DATA_MAPPING,
        select: SELECT,
      });
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new errors.NotFoundException(
          `No resource was found for ${JSON.stringify(params)}`
        );
      }
      throw error;
    }
  }

  @nestAccessControl.UseRoles({
    resource: ENTITY_NAME,
    action: "delete",
    possession: "any",
  })
  @common.Delete(DELETE_PATH)
  @swagger.ApiOkResponse({ type: ENTITY })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async DELETE_ENTITY_FUNCTION(
    @common.Param() params: WHERE_UNIQUE_INPUT
  ): Promise<ENTITY | null> {
    try {
      return await this.service.delete({
        where: params,
        select: SELECT,
      });
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new errors.NotFoundException(
          `No resource was found for ${JSON.stringify(params)}`
        );
      }
      throw error;
    }
  }
}
