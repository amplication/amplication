import { Module, forwardRef } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { GenerationLogModuleBase } from "./base/generationLog.module.base";
import { GenerationLogService } from "./generationLog.service";
import { GenerationLogController } from "./generationLog.controller";

@Module({
  imports: [GenerationLogModuleBase, forwardRef(() => AuthModule)],
  controllers: [GenerationLogController],
  providers: [GenerationLogService],
  exports: [GenerationLogService],
})
export class GenerationLogModule {}
