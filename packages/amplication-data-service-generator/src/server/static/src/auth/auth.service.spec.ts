import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
// @ts-ignore
// eslint-disable-next-line
import { UserService, User } from "../user/user.service";
import { PasswordService } from "./password.service";

const VALID_USER: User = {
  username: "Valid User",
  password: "Valid User Password",
};
const INVALID_USER: User = {
  username: "Invalid User",
  password: "Invalid User Password",
};

const userService = {
  findOne(args: { where: { username: string } }): User | null {
    if (args.where.username === VALID_USER.username) {
      return VALID_USER;
    }
    return null;
  },
};

const passwordService = {
  compare(password: string, encrypted: string) {
    return true;
  },
};

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: userService,
        },
        {
          provide: PasswordService,
          useValue: passwordService,
        },
        AuthService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should validate a valid user", async () => {
    await expect(
      service.validateUser(VALID_USER.username, VALID_USER.password)
    ).resolves.toEqual({
      username: VALID_USER.username,
    });
  });

  it("should not validate a invalid user", async () => {
    await expect(
      service.validateUser(INVALID_USER.username, INVALID_USER.password)
    ).resolves.toBe(null);
  });
});
