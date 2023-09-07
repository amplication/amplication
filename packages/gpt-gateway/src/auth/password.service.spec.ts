import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { PasswordService } from "./password.service";

const EXAMPLE_PASSWORD = "examplePassword";
const EXAMPLE_HASHED_PASSWORD = "exampleHashedPassword";

const EXAMPLE_SALT_OR_ROUNDS = 1;

const configServiceGetMock = jest.fn(() => {
  return EXAMPLE_SALT_OR_ROUNDS;
});

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

const { hash, compare } = jest.requireMock("bcrypt");

hash.mockImplementation(async () => EXAMPLE_HASHED_PASSWORD);

compare.mockImplementation(async () => true);

describe("PasswordService", () => {
  let service: PasswordService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordService,
        {
          provide: ConfigService,
          useClass: jest.fn(() => ({
            get: configServiceGetMock,
          })),
        },
      ],
      imports: [],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should have salt defined", () => {
    expect(service.salt).toEqual(EXAMPLE_SALT_OR_ROUNDS);
  });

  it("should compare a password", async () => {
    const args = {
      password: EXAMPLE_PASSWORD,
      hashedPassword: EXAMPLE_HASHED_PASSWORD,
    };
    await expect(
      service.compare(args.password, args.hashedPassword)
    ).resolves.toEqual(true);
  });

  it("should hash a password", async () => {
    await expect(service.hash(EXAMPLE_PASSWORD)).resolves.toEqual(
      EXAMPLE_HASHED_PASSWORD
    );
  });
});
