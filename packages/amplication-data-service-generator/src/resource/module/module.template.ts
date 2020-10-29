import { Module } from "@nestjs/common";
import { MorganModule } from "nest-morgan";
import { PrismaModule } from "nestjs-prisma";
import { ACLModule } from "../auth/acl.module";
import { AuthModule } from "../auth/auth.module";

declare class CONTROLLER {}
declare class SERVICE {}

@Module({
  imports: [ACLModule, AuthModule, MorganModule, PrismaModule],
  controllers: [CONTROLLER],
  providers: [SERVICE],
  exports: [SERVICE],
})
export class MODULE {}
