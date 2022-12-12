import { Module, forwardRef } from "@nestjs/common";
import { MorganModule } from "nest-morgan";

// @ts-ignore
import { ACLModule } from "../../auth/acl.module";
// @ts-ignore
import { AuthModule } from "../../auth/auth.module";

@Module({
  imports: [ACLModule, forwardRef(() => AuthModule), MorganModule],

  exports: [ACLModule, AuthModule, MorganModule],
})
export class MODULE_BASE {}
