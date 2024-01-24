import { Test, TestingModule } from "@nestjs/testing";
import { GptService } from "./gpt.service";
import { EnumActionStepStatus } from "../action/dto";
import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import { UserActionService } from "../userAction/userAction.service";
import { UserAction } from "../userAction/dto";
import {
  GptConversationStart,
  KAFKA_TOPICS,
} from "@amplication/schema-registry";
import { EnumUserActionType } from "../userAction/types";
import { ConversationTypeKey } from "./gpt.types";
import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";

const mockUserActionId = "userActionId";
const mockActionId = "actionId";
const mockResourceId = "resourceId";
const mockUserId = "userId";
const mockUserAction = {
  id: mockUserActionId,
  actionId: mockActionId,
  resourceId: mockResourceId,
  userActionType: EnumUserActionType.GptConversation,
  userId: mockUserId,
} as UserAction;

const mockServiceEmitMessage = jest
  .fn()
  .mockImplementation(
    (topic: string, message: GptConversationStart.KafkaEvent) =>
      Promise.resolve()
  );

const createUserActionByTypeWithInitialStepMock = jest
  .fn()
  .mockResolvedValue(mockUserAction);
const updateUserActionStepMock = jest.fn().mockResolvedValue(mockUserAction);
const updateUserActionMetadataMock = jest
  .fn()
  .mockResolvedValue(mockUserAction);
describe("GptService", () => {
  let service: GptService;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GptService,
        {
          provide: KafkaProducerService,
          useValue: { emitMessage: mockServiceEmitMessage },
        },
        {
          provide: UserActionService,
          useValue: {
            createUserActionByTypeWithInitialStep:
              createUserActionByTypeWithInitialStepMock,
            updateUserActionStep: updateUserActionStepMock,
            updateUserActionMetadata: updateUserActionMetadataMock,
          },
        },
        MockedAmplicationLoggerProvider,
      ],
    }).compile();

    service = module.get<GptService>(GptService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("startConversation", () => {
    it("should create user action and emit kafka message to start conversation", async () => {
      const result = await service.startConversation(
        ConversationTypeKey.BreakTheMonolith,
        [
          {
            name: "userInput",
            value: "prompt",
          },
        ],
        mockUserId,
        mockResourceId
      );

      expect(createUserActionByTypeWithInitialStepMock).toBeCalledTimes(1);
      expect(createUserActionByTypeWithInitialStepMock).toBeCalledWith(
        EnumUserActionType.GptConversation,
        {},
        {
          name: "START_CONVERSATION",
          message: "Emitting event to start conversation with GPT gateway",
          status: EnumActionStepStatus.Waiting,
        },
        mockUserId,
        mockResourceId
      );
      expect(mockServiceEmitMessage).toBeCalledTimes(1);
      expect(mockServiceEmitMessage).toBeCalledWith(
        KAFKA_TOPICS.AI_CONVERSATION_START_TOPIC,
        {
          key: { requestUniqueId: mockUserActionId },
          value: {
            requestUniqueId: mockUserActionId,
            messageTypeKey: ConversationTypeKey.BreakTheMonolith,
            params: [
              {
                name: "userInput",
                value: "prompt",
              },
            ],
          } as GptConversationStart.Value,
        }
      );
      expect(result).toEqual(mockUserAction);
    });
  });
  describe("onConversationCompleted", () => {
    it("should update user action status and metadata when there is not error message", async () => {
      await service.onConversationCompleted({
        success: true,
        requestUniqueId: mockUserActionId,
        errorMessage: null,
        result: '{"result": 123}',
      });
      expect(updateUserActionStepMock).toBeCalledTimes(1);
      expect(updateUserActionStepMock).toBeCalledWith(
        mockUserActionId,
        "START_CONVERSATION",
        EnumActionStepStatus.Success
      );
      expect(updateUserActionMetadataMock).toBeCalledTimes(1);
      expect(updateUserActionMetadataMock).toBeCalledWith(mockUserActionId, {
        result: 123,
      });
    });
  });

  it("should update user action status but not the metadata when there is a error message", async () => {
    await service.onConversationCompleted({
      success: true,
      requestUniqueId: mockUserActionId,
      errorMessage: "error message",
      result: null,
    });
    expect(updateUserActionStepMock).toBeCalledTimes(1);
    expect(updateUserActionStepMock).toBeCalledWith(
      mockUserActionId,
      "START_CONVERSATION",
      EnumActionStepStatus.Success
    );
    expect(updateUserActionMetadataMock).toBeCalledTimes(0);
  });
});
