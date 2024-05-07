import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { TemplateServiceBase } from "./base/template.service.base";
import {
  OpenaiService,
  CreateChatCompletionRequestSettings,
  ChatCompletionMessageParam,
} from "../../providers/openai/openai.service";
import { GptConversationStart } from "@amplication/schema-registry";
import { ProcessTemplateInput } from "./dto/ProcessTemplateInput";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";

@Injectable()
export class TemplateService extends TemplateServiceBase {
  constructor(
    protected readonly prisma: PrismaService,
    private openaiService: OpenaiService,
    private readonly logger: AmplicationLogger
  ) {
    super(prisma);
  }

  //replace all params in message based on placeholder in the form of {{param}}
  //e.g. {{name}} will be replaced with params.name
  prepareMessage(
    message: string,
    params: GptConversationStart.Value["params"]
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

    let customParams: CreateChatCompletionRequestSettings = {};
    if (template.params) {
      try {
        customParams = JSON.parse(template.params);
      } catch (error) {
        this.logger.error(
          `Failed to parse custom params for template ${template.id}. Default params will be used.`,
          error,
          { templateName: template.name, params: template.params }
        );
      }
    }

    return this.openaiService.createChatCompletion(
      template.model.name,
      messages,
      customParams
    );
  }
}
