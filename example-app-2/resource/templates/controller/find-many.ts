import { Get, Query } from "@nestjs/common";

interface QUERY {}
interface PARAMS {}
interface ENTITY {}
declare var PATH: string;

class FindManyMixin {
  // @ts-ignore
  service: {
    findMany: (args: QUERY & { where: PARAMS }) => Promise<ENTITY[]>;
  };
  @Get()
  findMany(@Query() query: QUERY): Promise<ENTITY[]> {
    return this.service.findMany({ where: query });
  }
}
