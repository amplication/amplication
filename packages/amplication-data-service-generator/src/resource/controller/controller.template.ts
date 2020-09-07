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
declare const UPDATE_PATH: string;
declare const DELETE_PATH: string;
declare interface FIND_ONE_QUERY {}

declare interface SERVICE {
  create(args: { data: CREATE_INPUT }): Promise<ENTITY>;
  findMany(args: { where: WHERE_INPUT }): Promise<ENTITY[]>;
  findOne(args: { where: WHERE_UNIQUE_INPUT }): Promise<ENTITY | null>;
  update(args: {
    where: WHERE_UNIQUE_INPUT;
    data: UPDATE_INPUT;
  }): Promise<ENTITY>;
  delete(args: { where: WHERE_UNIQUE_INPUT }): Promise<ENTITY>;
}

declare const RESOURCE: string;
declare const ENTITY_NAME: string;

@Controller(RESOURCE)
export class CONTROLLER {
  constructor(private readonly service: SERVICE) {}

  @UseGuards(AuthGuard("basic"), ACGuard)
  @Post()
  @UseRoles({
    resource: ENTITY_NAME,
    action: "create",
    possession: "any",
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
    resource: ENTITY_NAME,
    action: "read",
    possession: "any",
  })
  findMany(@Query() query: WHERE_INPUT): Promise<ENTITY[]> {
    return this.service.findMany({ where: query });
  }

  @UseGuards(AuthGuard("basic"), ACGuard)
  @Get(FINE_ONE_PATH)
  @UseRoles({
    resource: ENTITY_NAME,
    action: "read",
    possession: "any",
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
    data: UPDATE_INPUT
  ): Promise<ENTITY | null> {
    return this.service.update({ ...query, where: params, data });
  }

  @UseGuards(AuthGuard("basic"), ACGuard)
  @Get(DELETE_PATH)
  @UseRoles({
    resource: ENTITY_NAME,
    action: "delete",
    possession: "any",
  })
  async delete(
    @Query() query: DELETE_QUERY,
    @Param() params: WHERE_UNIQUE_INPUT
  ): Promise<ENTITY | null> {
    return this.service.delete({ ...query, where: params });
  }
}
