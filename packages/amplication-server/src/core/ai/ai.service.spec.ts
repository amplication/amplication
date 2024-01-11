import { PrismaService } from "../../prisma";
import { EXAMPLE_RESOURCE } from "./__tests__/resource.mock";
import { AiService } from "./ai.service";
import { PromptManagerService } from "./prompt-manager.service";
import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import { TestingModule, Test } from "@nestjs/testing";

jest.mock("../../prisma");
jest.mock("./prompt-manager.service");
jest.mock("@amplication/util/nestjs/kafka");

describe("AiService", () => {
  let service: AiService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        PromptManagerService,
        KafkaProducerService,
        {
          provide: PrismaService,
          useValue: {
            resource: {
              findUnique: jest.fn().mockResolvedValue(EXAMPLE_RESOURCE),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("triggerGenerationBtmResourceRecommendation", () => {
    it("should return the generated prompt", async () => {
      jest
        .spyOn(
          PromptManagerService.prototype,
          "generatePromptForBreakTheMonolith"
        )
        .mockReturnValue("Ciao ciao");

      const result = await service.triggerGenerationBtmResourceRecommendation(
        "resourceId"
      );

      expect(result).toEqual("Ciao ciao");
    });
  });
});
