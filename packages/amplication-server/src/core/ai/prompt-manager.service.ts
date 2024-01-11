import { PromptManagerGeneratePromptForBreakTheMonolithArgs } from "./prompt-manager.types";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PromptManagerService {
  generatePromptForBreakTheMonolith(
    args: PromptManagerGeneratePromptForBreakTheMonolithArgs
  ): string {
    const { entities } = args;

    const prompt: string[] = [];

    entities.forEach((entity) => {
      prompt.push(`model ${entity.displayName} has the following fields:`);
      entity.fields.forEach((field) => {
        prompt.push(` - ${field.displayName} (type:${field.dataType})`);
      });
    });

    return prompt.join("\n");
  }
}
