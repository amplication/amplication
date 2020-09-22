import { Module } from "@nestjs/common";
import { PrismaModule } from "nestjs-prisma";

declare class CONTROLLER {}
declare class SERVICE {}

@Module({
  imports: [PrismaModule],
  controllers: [CONTROLLER],
  providers: [SERVICE],
  exports: [SERVICE],
})
export class MODULE {}
