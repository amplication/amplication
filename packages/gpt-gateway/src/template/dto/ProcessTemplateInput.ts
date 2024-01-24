import { AiConversationStart } from "@amplication/schema-registry";

class ProcessTemplateInput {
  templateId!: string;

  params!: AiConversationStart.Value["params"];
}

export { ProcessTemplateInput };
