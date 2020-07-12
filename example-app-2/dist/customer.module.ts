import { Module } from "@nestjs/common";
import { PrismaModule } from "../../templates/prisma/prisma.module";
import { CustomerController } from "./customer.controller";
import { CustomerService } from "resource/templates/controller/node_modules/./customer.service";

@Module({
  imports: [PrismaModule],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
