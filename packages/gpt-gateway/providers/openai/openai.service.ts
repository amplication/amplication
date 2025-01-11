import { Injectable } from "@nestjs/common";
import OpenAI from "openai";
import { ContentLengthExceededError } from "../../src/errors/ContentLengthExceededError";

export type CreateChatCompletionRequestSettings = Omit<
  OpenAI.Chat.ChatCompletionCreateParamsNonStreaming,
  "model" | "messages"
>;

export type ChatCompletionMessageParam = OpenAI.Chat.ChatCompletionMessageParam;

const CREATE_CHAT_COMPLETION_DEFAULT_SETTINGS: CreateChatCompletionRequestSettings =
  {
    temperature: 1,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  };

@Injectable()
export class OpenaiService {
  async createChatCompletion(
    model: string,
    messages: OpenAI.Chat.ChatCompletionMessageParam[],
    requestSettings?: CreateChatCompletionRequestSettings
  ): Promise<string> {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const settings = {
      ...CREATE_CHAT_COMPLETION_DEFAULT_SETTINGS,
      ...requestSettings,
    };

    try {
      const response = await openai.chat.completions.create({
        ...settings,
        model: model,
        messages: messages,
      });
      const results = response.choices[0].message?.content || "";

      return results;
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        // Add custom error handling here. Check codes: https://github.com/openai/openai-node?tab=readme-ov-file#handling-errors
        if (error.status === 400 && error.code === "context_length_exceeded")
          throw new ContentLengthExceededError(error.message);
      }
      throw error;
    }
  }
}
