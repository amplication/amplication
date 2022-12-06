import { Module } from "@nestjs/common";
import { MorganModule } from "nest-morgan";
import { PrismaModule } from "nestjs-prisma";

@Module({
  imports: [MorganModule, PrismaModule],

  exports: [MorganModule, PrismaModule],
})
export class MODULE_BASE {}
