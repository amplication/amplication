import { Module } from "@nestjs/common";
import { ProfileModuleBase } from "./base/profile.module.base";
import { ProfileService } from "./profile.service";
import { ProfileController } from "./profile.controller";
import { ProfileResolver } from "./profile.resolver";

@Module({
  imports: [ProfileModuleBase],
  controllers: [ProfileController],
  providers: [ProfileService, ProfileResolver],
  exports: [ProfileService],
})
export class ProfileModule {}
