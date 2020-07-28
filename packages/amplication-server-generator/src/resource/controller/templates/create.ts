import { Post, Query, Body, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

declare interface QUERY {}
declare interface BODY_TYPE {}
declare interface CONTENT {}

class CreateMixin {
  // @ts-ignore
  service: {
    create: (args: QUERY & { data: BODY_TYPE }) => Promise<CONTENT>;
  };
  @UseGuards(AuthGuard("basic"))
  @Post()
  create(@Query() query: QUERY, @Body() data: BODY_TYPE): Promise<CONTENT> {
    return this.service.create({ ...query, data });
  }
}
