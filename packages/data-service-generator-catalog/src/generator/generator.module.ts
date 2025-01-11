import { Module, forwardRef } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { GeneratorModuleBase } from "./base/generator.module.base";
import { GeneratorService } from "./generator.service";
import { GeneratorController } from "./generator.controller";
import { GeneratorResolver } from "./generator.resolver";

@Module({
  imports: [GeneratorModuleBase, forwardRef(() => AuthModule)],
  controllers: [GeneratorController],
  providers: [GeneratorService, GeneratorResolver],
  exports: [GeneratorService],
})
export class GeneratorModule {}
