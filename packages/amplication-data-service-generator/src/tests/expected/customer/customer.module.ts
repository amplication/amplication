import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { CustomerService } from "./customer.service";
import { CustomerController } from "./customer.controller";

@Module({
  imports: [PrismaModule],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
