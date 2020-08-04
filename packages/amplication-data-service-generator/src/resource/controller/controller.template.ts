import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Param,
  UseGuards,
  NotFoundException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
  // @ts-ignore
  ENTITY,
  // @ts-ignore
  CREATE_INPUT,
  // @ts-ignore
  WHERE_INPUT,
  // @ts-ignore
  WHERE_UNIQUE_INPUT,
} from "@prisma/client";

declare interface CREATE_QUERY {}

declare const FINE_ONE_PATH: string;
declare interface FIND_ONE_QUERY {}

declare interface SERVICE {
  create: (args: { data: CREATE_INPUT }) => Promise<ENTITY>;
  findMany: (args: { where: WHERE_INPUT }) => Promise<ENTITY[]>;
  findOne: (args: { where: WHERE_UNIQUE_INPUT }) => Promise<ENTITY | null>;
}

declare var RESOURCE: string;

@Controller(RESOURCE)
export class CONTROLLER {
  constructor(private readonly service: SERVICE) {}

  @UseGuards(AuthGuard("basic"))
  @Post()
  create(
    @Query() query: CREATE_QUERY,
    @Body() data: CREATE_INPUT
  ): Promise<ENTITY> {
    return this.service.create({ ...query, data });
  }

  @Get()
  findMany(@Query() query: WHERE_INPUT): Promise<ENTITY[]> {
    return this.service.findMany({ where: query });
  }

  @Get(FINE_ONE_PATH)
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
}
