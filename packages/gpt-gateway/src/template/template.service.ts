import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { TemplateServiceBase } from "./base/template.service.base";
import {
  OpenaiService,
  CreateChatCompletionRequestSettings,
  ChatCompletionMessageParam,
} from "../../providers/openai/openai.service";
import { AiConversationStart } from "@amplication/schema-registry";
import { ProcessTemplateInput } from "./dto/ProcessTemplateInput";
import { ContentLengthExceededError } from "../errors/ContentLengthExceededError";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";

@Injectable()
export class TemplateService extends TemplateServiceBase {
  constructor(
    protected readonly prisma: PrismaService,
    private openaiService: OpenaiService,
    @Inject(AmplicationLogger)
    private logger: AmplicationLogger
  ) {
    super(prisma);
  }

  //replace all params in message based on placeholder in the form of {{param}}
  //e.g. {{name}} will be replaced with params.name
  prepareMessage(
    message: string,
    params: AiConversationStart.Value["params"]
  ): string {
    const paramsObj = params.reduce((acc, param) => {
      acc[param.name] = param.value;
      return acc;
    }, {} as Record<string, string>);

    let output = message;
    for (const key in paramsObj) {
      const placeholder = `{{${key}}}`;
      const value = paramsObj[key];
      output = output.replaceAll(placeholder, value);
    }
    return output;
  }

  async processTemplateMessage(
    args: ProcessTemplateInput
  ): Promise<string | null> {
    const template = await this.prisma.template.findUnique({
      where: {
        id: args.templateId,
      },
      include: {
        model: true,
        fallbackModel: true,
        messages: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    if (!template) {
      throw new Error(`Template not found for template id: ${args.templateId}`);
    }

    const messages = template.messages.map((message) => ({
      role: message.role.toLowerCase(),
      content: this.prepareMessage(message.content, args.params),
    })) as ChatCompletionMessageParam[];

    let result: string = null;
    try {
      result = await this.openaiService.createChatCompletion(
        template.model.name,
        messages,
        template.params as CreateChatCompletionRequestSettings
      );
    } catch (error) {
      if (error instanceof ContentLengthExceededError) {
        if (template.fallbackModel) {
          this.logger.warn("Content length exceeded, using fallback model", {
            errorMessage: error.message,
            templateName: template.name,
            fallbackModelName: template.fallbackModel.name,
          });
          result = await this.openaiService.createChatCompletion(
            template.fallbackModel.name,
            messages,
            template.params as CreateChatCompletionRequestSettings
          );
        }
      }
    }
    return result;
  }
}
