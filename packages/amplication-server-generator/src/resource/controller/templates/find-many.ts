import { Get, Query } from "@nestjs/common";

declare interface QUERY {}
declare interface PARAMS {}
declare interface CONTENT {}

class FindManyMixin {
  // @ts-ignore
  service: {
    findMany: (args: QUERY & { where: PARAMS }) => Promise<CONTENT>;
  };
  @Get()
  findMany(@Query() query: QUERY): Promise<CONTENT> {
    return this.service.findMany({ where: query });
  }
}
