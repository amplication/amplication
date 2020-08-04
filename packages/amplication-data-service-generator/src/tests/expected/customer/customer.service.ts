import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  Customer,
  CustomerCreateArgs,
  FindManyCustomerArgs,
  FindOneCustomerArgs,
} from "@prisma/client";

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}
  create(args: CustomerCreateArgs): Promise<Customer> {
    return this.prisma.customer.create(args);
  }
  findMany(args: FindManyCustomerArgs): Promise<Customer[]> {
    return this.prisma.customer.findMany(args);
  }
  findOne(args: FindOneCustomerArgs): Promise<Customer | null> {
    return this.prisma.customer.findOne(args);
  }
}
