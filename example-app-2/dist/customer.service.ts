import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { Customer } from "./Customer";

import {
  FindOneCustomerArgs,
  FindManyCustomerArgs,
  CustomerCreateArgs,
} from "@prisma/client";

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  findMany(args: FindManyCustomerArgs): Promise<Customer[]> {
    return this.prisma.customer.findMany(args);
  }
  create(args: CustomerCreateArgs): Promise<Customer> {
    return this.prisma.customer.create(args);
  }
  findOne(args: FindOneCustomerArgs): Promise<Customer | null> {
    return this.prisma.customer.findOne(args);
  }
}
