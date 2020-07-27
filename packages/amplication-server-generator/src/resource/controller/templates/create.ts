import { Post, Query, Body } from "@nestjs/common";

declare interface QUERY {}
declare interface BODY_TYPE {}
declare interface CONTENT {}

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
