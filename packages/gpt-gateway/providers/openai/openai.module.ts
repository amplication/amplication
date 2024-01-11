import { OpenaiService } from "./openai.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [OpenaiService],
  exports: [OpenaiService],
})
export class OpenAIModule {}
