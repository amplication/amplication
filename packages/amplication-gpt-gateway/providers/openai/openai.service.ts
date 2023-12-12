import { Injectable } from "@nestjs/common";
import {
  Configuration,
  OpenAIApi,
  ChatCompletionRequestMessage,
  CreateChatCompletionRequest,
} from "openai";

export type CreateChatCompletionRequestSettings = Omit<
  CreateChatCompletionRequest,
  "model" | "messages"
>;

export {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
} from "openai";

const CREATE_CHAT_COMPLETION_DEFAULT_SETTINGS: CreateChatCompletionRequestSettings =
  {
    temperature: 1,
    max_tokens: 2048,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  };

@Injectable()
export class OpenaiService {
  constructor() {}

  async createChatCompletion(
    model: string,
    messages: ChatCompletionRequestMessage[],
    requestSettings?: CreateChatCompletionRequestSettings
  ): Promise<string> {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const settings = {
      ...CREATE_CHAT_COMPLETION_DEFAULT_SETTINGS,
      ...requestSettings,
    };

    const response = await openai.createChatCompletion({
      ...settings,
      model: model,
      messages: messages,
    });

    const results = response.data.choices[0].message?.content || "";

    return results;
  }
}
