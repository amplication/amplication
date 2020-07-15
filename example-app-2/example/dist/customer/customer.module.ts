import { Module } from "@nestjs/common";
// @ts-ignore: Cannot find module '../prisma/prisma.module' or its corresponding type declarations.
import { PrismaModule } from "../prisma/prisma.module";
import { CustomerController } from "./customer.controller";
import { CustomerService } from "./customer.service";

@Module({
  imports: [PrismaModule],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
