import { Post, Query, Body } from "@nestjs/common";

interface QUERY {}
interface BODY_TYPE {}
interface ENTITY {}
declare var PATH: string;

class CreateMixin {
  // @ts-ignore
  service: {
    create: (args: QUERY & { data: BODY_TYPE }) => Promise<ENTITY[]>;
  };
  @Post()
  create(@Query() query: QUERY, @Body() data: BODY_TYPE): Promise<ENTITY> {
    return this.service.create({ ...query, data });
  }
}
