import { Module } from "@nestjs/common";
import { PromptManagerService } from "./prompt-manager.service";

@Module({
  providers: [PromptManagerService],
  exports: [PromptManagerService],
})
export class AiModule {}
