import { AuthModule } from "../auth/auth.module";
import { AwsEcrModule } from "../aws/aws-ecr.module";
import { VersionModuleBase } from "./base/version.module.base";
import { VersionController } from "./version.controller";
import { VersionResolver } from "./version.resolver";
import { VersionService } from "./version.service";
import { Module, forwardRef } from "@nestjs/common";

@Module({
  imports: [VersionModuleBase, forwardRef(() => AuthModule), AwsEcrModule],
  controllers: [VersionController],
  providers: [VersionService, VersionResolver],
  exports: [VersionService],
})
export class VersionModule {}
