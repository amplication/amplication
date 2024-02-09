import { GptConversationStart } from "@amplication/schema-registry";

class ProcessTemplateInput {
  templateId!: string;

  params!: GptConversationStart.Value["params"];
}

export { ProcessTemplateInput };
