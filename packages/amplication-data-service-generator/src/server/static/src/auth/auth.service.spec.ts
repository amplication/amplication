import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
// @ts-ignore
// eslint-disable-next-line
import { User } from "src/user/base/User";
// @ts-ignore
// eslint-disable-next-line
import { UserService } from "../user/user.service";
import { AuthService } from "./auth.service";
import { Credentials } from "./Credentials";
import { PasswordService } from "./password.service";

const VALID_CREDENTIALS: Credentials = {
  username: "Valid User",
  password: "Valid User Password",
};
const INVALID_CREDENTIALS: Credentials = {
  username: "Invalid User",
  password: "Invalid User Password",
};
const USER: User = {
  ...VALID_CREDENTIALS,
  createdAt: new Date(),
  firstName: "ofek",
  id: "1",
  lastName: "gabay",
  roles: ["admin"],
  updatedAt: new Date(),
};

const signToken = "signToken";

const userService = {
  findOne(args: { where: { username: string } }): User | null {
    if (args.where.username === VALID_CREDENTIALS.username) {
      return USER;
    }
    return null;
  },
};

const passwordService = {
  compare(password: string, encrypted: string) {
    return true;
  },
};

const jwtService = {
  signAsync() {
    return Promise.resolve(signToken);
  },
};

describe("AuthService", () => {
  //ARRANGE
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
        {
          provide: JwtService,
          useValue: jwtService,
        },
        AuthService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("Testing the authService.validateUser()", () => {
    it("should validate a valid user", async () => {
      await expect(
        service.validateUser(
          VALID_CREDENTIALS.username,
          VALID_CREDENTIALS.password
        )
      ).resolves.toEqual({
        username: USER.username,
        roles: USER.roles,
      });
    });

    it("should not validate a invalid user", async () => {
      await expect(
        service.validateUser(
          INVALID_CREDENTIALS.username,
          INVALID_CREDENTIALS.password
        )
      ).resolves.toBe(null);
    });
  });

  describe("Testing the authService.login()", () => {
    it("should return userInfo object for correct username and password", async () => {
      const loginResult = await service.login(VALID_CREDENTIALS);
      expect(loginResult).toEqual({
        username: USER.username,
        roles: USER.roles,
        accessToken: signToken,
      });
    });
  });
});
