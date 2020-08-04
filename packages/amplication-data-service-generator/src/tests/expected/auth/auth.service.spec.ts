import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService, User } from "../users/users.service";

const VALID_USER: User = {
  username: "Valid User",
  password: "Valid User Password",
};
const INVALID_USER: User = {
  username: "Invalid User",
  password: "Invalid User Password",
};

const userService = {
  findOne(username: string): User | undefined {
    if (VALID_USER.username === username) {
      return VALID_USER;
    }
    if (INVALID_USER.username === username) {
      return INVALID_USER;
    }
  },
};

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .overrideProvider(UsersService)
      .useValue(userService)
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should validate a valid user", () => {
    expect(service.validateUser(VALID_USER.username, VALID_USER.password)).toBe(
      VALID_USER
    );
  });

  it("should not validate a invalid user", () => {
    expect(
      service.validateUser(INVALID_USER.username, INVALID_USER.password)
    ).toBe(INVALID_USER);
  });
});
