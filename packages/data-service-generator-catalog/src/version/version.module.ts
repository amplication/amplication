import { Module, forwardRef } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { VersionModuleBase } from "./base/version.module.base";
import { VersionService } from "./version.service";
import { VersionController } from "./version.controller";
import { VersionResolver } from "./version.resolver";

@Module({
  imports: [VersionModuleBase, forwardRef(() => AuthModule)],
  controllers: [VersionController],
  providers: [VersionService, VersionResolver],
  exports: [VersionService],
})
export class VersionModule {}
