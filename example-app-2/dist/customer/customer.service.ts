import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Customer } from "../dto/Customer";
import { FindOneCustomerArgs, FindManyCustomerArgs } from "@prisma/client";
import { CustomerInput } from "../dto/CustomerInput";
@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  findMany(args: FindManyCustomerArgs): Promise<Customer[]> {
    return this.prisma.customer.findMany(args);
  }

  create(data: CustomerInput): Promise<Customer> {
    return this.prisma.customer.create({
      data,
    });
  }

  findOne(args: FindOneCustomerArgs): Promise<Customer | null> {
    return this.prisma.customer.findOne(args);
  }
}
