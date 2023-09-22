import { ConfigService } from "@nestjs/config";
import { CodeGeneratorService } from "./code-generator-catalog.service";
import { Test, TestingModule } from "@nestjs/testing";
import { Env } from "../env";
import axios from "axios";
import { CodeGeneratorVersionStrategy } from "@amplication/code-gen-types/models";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("CodeGeneratorService", () => {
  let service: CodeGeneratorService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: (variable) => {
              switch (variable) {
                case Env.DSG_CATALOG_SERVICE_URL:
                  return "http://localhost:3000/";
                default:
                  return "";
              }
            },
          },
        },
        CodeGeneratorService,
      ],
    }).compile();

    service = module.get<CodeGeneratorService>(CodeGeneratorService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it.each([
    ["v1.0.1", CodeGeneratorVersionStrategy.Specific],
    ["v2.1.1", CodeGeneratorVersionStrategy.LatestMajor],
    ["v1.2.0", CodeGeneratorVersionStrategy.LatestMinor],
  ])(
    `should return version %s when %s is selected`,
    async (
      expected: string,
      codeGeneratorStrategy: CodeGeneratorVersionStrategy
    ) => {
      const selectedVersion = "v1.0.1";

      mockedAxios.post.mockImplementation((url) => {
        if (
          url === "http://localhost:3000/api/versions/code-generator-version"
        ) {
          return Promise.resolve({
            data: {
              name: expected,
            },
          });
        }
      });

      const result = await service.getCodeGeneratorVersion({
        codeGeneratorVersion: selectedVersion,
        codeGeneratorStrategy,
      });

      expect(result).toEqual(expected);
    }
  );
});
