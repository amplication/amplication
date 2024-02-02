import * as common from "@nestjs/common";
import { Request } from "express";
import { ApiNestedQuery } from "../../decorators/api-nested-query.decorator";
import { plainToClass } from "class-transformer";
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

  UPDATE_FUNCTION(args: {
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
  constructor(private readonly service: SERVICE) {}

  @common.Get(FIND_MANY_PATH)
  @ApiNestedQuery(RELATED_ENTITY_FIND_MANY_ARGS)
  async FIND_MANY(
    @common.Req() request: Request,
    @common.Param() params: WHERE_UNIQUE_INPUT
  ): Promise<RELATED_ENTITY[]> {
    const query = plainToClass(RELATED_ENTITY_FIND_MANY_ARGS, request.query);
    const results = await this.service.FIND_PROPERTY(params.id, {
      ...query,
      select: SELECT,
    });
    if (results === null) {
      throw new errors.NotFoundException(
        `No resource was found for ${JSON.stringify(params)}`
      );
    }
    return results;
  }

  @common.Post(CREATE_PATH)
  async CONNECT(
    @common.Param() params: WHERE_UNIQUE_INPUT,
    @common.Body() body: RELATED_ENTITY_WHERE_UNIQUE_INPUT[]
  ): Promise<void> {
    const data = {
      PROPERTY: {
        connect: body,
      },
    };
    await this.service.UPDATE_FUNCTION({
      where: params,
      data,
      select: { id: true },
    });
  }

  @common.Patch(UPDATE_PATH)
  async UPDATE(
    @common.Param() params: WHERE_UNIQUE_INPUT,
    @common.Body() body: RELATED_ENTITY_WHERE_UNIQUE_INPUT[]
  ): Promise<void> {
    const data = {
      PROPERTY: {
        set: body,
      },
    };
    await this.service.UPDATE_FUNCTION({
      where: params,
      data,
      select: { id: true },
    });
  }

  @common.Delete(DELETE_PATH)
  async DISCONNECT(
    @common.Param() params: WHERE_UNIQUE_INPUT,
    @common.Body() body: RELATED_ENTITY_WHERE_UNIQUE_INPUT[]
  ): Promise<void> {
    const data = {
      PROPERTY: {
        disconnect: body,
      },
    };
    await this.service.UPDATE_FUNCTION({
      where: params,
      data,
      select: { id: true },
    });
  }
}
