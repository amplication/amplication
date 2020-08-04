import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Param,
  UseGuards,
  NotFoundException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import {
  Customer,
  CustomerCreateInput,
  CustomerWhereInput,
  CustomerWhereUniqueInput,
} from "@prisma/client";

import { CustomerService } from "./customer.service";

@Controller("customers")
export class CustomerController {
  constructor(private readonly service: CustomerService) {}

  @UseGuards(AuthGuard("basic"))
  @Post()
  create(
    @Query() query: {},
    @Body() data: CustomerCreateInput
  ): Promise<Customer> {
    return this.service.create({ ...query, data });
  }

  @Get()
  findMany(@Query() query: CustomerWhereInput): Promise<Customer[]> {
    return this.service.findMany({ where: query });
  }

  @Get("/:id")
  async findOne(
    @Query() query: {},
    @Param() params: CustomerWhereUniqueInput
  ): Promise<Customer | null> {
    const result = await this.service.findOne({ ...query, where: params });
    if (result === null) {
      throw new NotFoundException(
        `No resource was found for ${JSON.stringify(params)}`
      );
    }
    return result;
  }
}
