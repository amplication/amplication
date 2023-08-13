import { Module } from "@nestjs/common";
import { OpenaiService } from "./openai.service";

@Module({
  providers: [OpenaiService],
  exports: [OpenaiService],
})
export class OpenAIModule {}
