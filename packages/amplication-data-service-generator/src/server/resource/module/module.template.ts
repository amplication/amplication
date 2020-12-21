import { Module, forwardRef } from "@nestjs/common";
import { MorganModule } from "nest-morgan";
import { PrismaModule } from "nestjs-prisma";
// @ts-ignore
import { ACLModule } from "../auth/acl.module";
// @ts-ignore
import { AuthModule } from "../auth/auth.module";

declare class CONTROLLER {}
declare class SERVICE {}
declare class RESOLVER {}

@Module({
  imports: [
    ACLModule,
    forwardRef(() => AuthModule),
    MorganModule,
    PrismaModule,
  ],
  controllers: [CONTROLLER],
  providers: [SERVICE, RESOLVER],
  exports: [SERVICE],
})
export class MODULE {}
