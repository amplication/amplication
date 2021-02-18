import { Module, forwardRef } from "@nestjs/common";
import { MorganModule } from "nest-morgan";
import { PrismaModule } from "nestjs-prisma";
// @ts-ignore
import { ACLModule } from "../../auth/acl.module";
// @ts-ignore
import { AuthModule } from "../../auth/auth.module";

@Module({
  imports: [
    ACLModule,
    forwardRef(() => AuthModule),
    MorganModule,
    PrismaModule,
  ],

  exports: [ACLModule, AuthModule, MorganModule, PrismaModule],
})
export class MODULE_BASE {}
