import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { Env } from "../../env";
import { BlockService } from "../block/block.service";
import { ResourceService } from "../resource/resource.service";
import { PrivatePluginService } from "./privatePlugin.service";

describe("PrivatePluginService", () => {
  let service: PrivatePluginService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: BlockService,
          useClass: jest.fn(() => ({})),
        },
        {
          provide: ResourceService,
          useValue: {},
        },

        MockedAmplicationLoggerProvider,

        {
          provide: ConfigService,
          useValue: {
            get: (variable) => {
              switch (variable) {
                case Env.FEATURE_CUSTOM_ACTIONS_ENABLED:
                  return "true";
                default:
                  return "";
              }
            },
          },
        },
        PrivatePluginService,
      ],
    }).compile();

    service = module.get<PrivatePluginService>(PrivatePluginService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
