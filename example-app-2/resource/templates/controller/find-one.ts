import { Get, Query, Param, NotFoundException } from "@nestjs/common";

interface QUERY {}
interface PARAMS {}
interface CONTENT {}
declare var PATH: string;

class FindOneMixin {
  // @ts-ignore
  service: {
    findOne: (args: QUERY & { where: PARAMS }) => Promise<CONTENT>;
  };
  @Get(PATH)
  async findOne(
    @Query() query: QUERY,
    @Param() params: PARAMS
  ): Promise<CONTENT> {
    const result = await this.service.findOne({ ...query, where: params });
    if (result === null) {
      throw new NotFoundException(
        `No resource was found for ${JSON.stringify(query)}`
      );
    }
    return result;
  }
}
