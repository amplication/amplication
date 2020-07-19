import { Get, Query } from "@nestjs/common";

interface QUERY {}
interface PARAMS {}
interface CONTENT {}

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
