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
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Action, Possession } from "accesscontrol/lib/enums";
import { ACGuard, UseRoles } from "nest-access-control";
import {
  // @ts-ignore
  ENTITY,
  // @ts-ignore
  CREATE_INPUT,
  // @ts-ignore
  WHERE_INPUT,
  // @ts-ignore
  WHERE_UNIQUE_INPUT,
  // @ts-ignore
  UPDATE_INPUT,
} from "@prisma/client";

declare interface CREATE_QUERY {}
declare interface UPDATE_QUERY {}
declare interface DELETE_QUERY {}

declare const FINE_ONE_PATH: string;
declare const UPDATE_ONE_PATH: string;
declare const DELETE_ONE_PATH: string;
declare interface FIND_ONE_QUERY {}

declare interface SERVICE {
  create(args: { data: CREATE_INPUT }): Promise<ENTITY>;
  findMany(args: { where: WHERE_INPUT }): Promise<ENTITY[]>;
  findOne(args: { where: WHERE_UNIQUE_INPUT }): Promise<ENTITY | null>;
  updateOne(args: {
    where: WHERE_UNIQUE_INPUT;
    data: UPDATE_INPUT;
  }): Promise<ENTITY>;
  deleteOne(args: { where: WHERE_UNIQUE_INPUT }): Promise<ENTITY>;
}

declare var RESOURCE: string;

@Controller(RESOURCE)
export class CONTROLLER {
  constructor(private readonly service: SERVICE) {}

  @UseGuards(AuthGuard("basic"), ACGuard)
  @Post()
  @UseRoles({
    resource: RESOURCE,
    action: Action.CREATE as "create",
    possession: Possession.ANY as "any",
  })
  create(
    @Query() query: CREATE_QUERY,
    @Body() data: CREATE_INPUT
  ): Promise<ENTITY> {
    return this.service.create({ ...query, data });
  }

  @UseGuards(AuthGuard("basic"), ACGuard)
  @Get()
  @UseRoles({
    resource: RESOURCE,
    action: Action.READ as "read",
    possession: Possession.ANY as "any",
  })
  findMany(@Query() query: WHERE_INPUT): Promise<ENTITY[]> {
    return this.service.findMany({ where: query });
  }

  @UseGuards(AuthGuard("basic"), ACGuard)
  @Get(FINE_ONE_PATH)
  @UseRoles({
    resource: RESOURCE,
    action: Action.READ as "read",
    possession: Possession.ANY as "any",
  })
  async findOne(
    @Query() query: FIND_ONE_QUERY,
    @Param() params: WHERE_UNIQUE_INPUT
  ): Promise<ENTITY | null> {
    const result = await this.service.findOne({ ...query, where: params });
    if (result === null) {
      throw new NotFoundException(
        `No resource was found for ${JSON.stringify(params)}`
      );
    }
    return result;
  }

  @UseGuards(AuthGuard("basic"), ACGuard)
  @Patch(UPDATE_ONE_PATH)
  @UseRoles({
    resource: RESOURCE,
    action: Action.UPDATE as "update",
    possession: Possession.ANY as "any",
  })
  async updateOne(
    @Query() query: UPDATE_QUERY,
    @Param() params: WHERE_UNIQUE_INPUT,
    @Body()
    data: UPDATE_INPUT
  ): Promise<ENTITY | null> {
    return this.service.updateOne({ ...query, where: params, data });
  }

  @UseGuards(AuthGuard("basic"), ACGuard)
  @Get(DELETE_ONE_PATH)
  @UseRoles({
    resource: RESOURCE,
    action: Action.DELETE as "delete",
    possession: Possession.ANY as "any",
  })
  async deleteOne(
    @Query() query: DELETE_QUERY,
    @Param() params: WHERE_UNIQUE_INPUT
  ): Promise<ENTITY | null> {
    return this.service.deleteOne({ ...query, where: params });
  }
}
