import { Test, TestingModule } from "@nestjs/testing";
import { TemplateService } from "./template.service";
import { PrismaService } from "../prisma/prisma.service";
import { OpenaiService } from "../../providers/openai/openai.service";
import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";

describe("TemplateService", () => {
  let service: TemplateService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplateService,
        {
          provide: PrismaService,
          useValue: {},
        },
        {
          provide: OpenaiService,
          useValue: {},
        },
        MockedAmplicationLoggerProvider,
      ],
    }).compile();
    service = module.get<TemplateService>(TemplateService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it.each([
    ["Hello John", "Hello {{name}}", [{ name: "name", value: "John" }]],
    [
      "Hello John John John",
      "Hello {{name}} {{name}} {{name}}",
      [{ name: "name", value: "John" }],
    ],

    [
      "Hello John Wick",
      "Hello {{firstname}} {{lastname}}",
      [
        { name: "firstname", value: "John" },
        { name: "lastname", value: "Wick" },
      ],
    ],
  ])("should prepare message: %s", (expectedResult, message, params) => {
    const result = service.prepareMessage(message, params);
    expect(result).toEqual(expectedResult);
  });
});
