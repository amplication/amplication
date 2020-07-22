import { Post, Query, Body } from "@nestjs/common";

interface QUERY {}
interface BODY_TYPE {}
interface CONTENT {}

class CreateMixin {
  // @ts-ignore
  service: {
    create: (args: QUERY & { data: BODY_TYPE }) => Promise<CONTENT>;
  };
  @Post()
  create(@Query() query: QUERY, @Body() data: BODY_TYPE): Promise<CONTENT> {
    return this.service.create({ ...query, data });
  }
}
