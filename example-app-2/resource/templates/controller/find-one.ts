import { Get, Query, Param, NotFoundException } from "@nestjs/common";

interface QUERY {}
interface PARAMS {}
interface ENTITY {}
declare var PATH: string;

// @ts-ignore
class FindOneMixin {
  // @ts-ignore
  service: {
    findOne: (args: QUERY & { where: PARAMS }) => Promise<ENTITY>;
  };
  /** Info for a specific customer */
  @Get(PATH)
  async findOne(
    @Query() query: QUERY,
    @Param() params: PARAMS
  ): Promise<ENTITY> {
    const entity = await this.service.findOne({ ...query, where: params });
    if (entity === null) {
      throw new NotFoundException(
        `No entity was found for ${JSON.stringify(query)}`
      );
    }
    return entity;
  }
}
