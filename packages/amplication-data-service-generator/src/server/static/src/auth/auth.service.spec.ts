import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
// @ts-ignore
// eslint-disable-next-line
import { UserService, User } from "../user/user.service";
import { PasswordService } from "./password.service";
import { Credentials } from "./Credentials";
import { MockUser } from "../tests/__mocks__/MockUser";
import { JwtService } from "@nestjs/jwt";
import { mock } from "jest-mock-extended";

const VALID_USER: User = {
  username: "Valid User",
  password: "Valid User Password",
};
const INVALID_USER: User = {
  username: "Invalid User",
  password: "Invalid User Password",
};

const signToken = "signToken";

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
          useValue: mock<JwtService>(),
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

  describe("Testing the authService.login()", () => {
    const validCredentials: Credentials = {
      password: "gabay",
      username: MockUser.username,
    };
    let passwordService = mock<PasswordService>();
    let jwtService = mock<JwtService>();

    beforeEach(() => {
      //ARRANGE
      const userService = mock<UserService>();
      userService.findOne
        .calledWith({
          where: { username: validCredentials.username },
        })
        .mockReturnValue(
          Promise.resolve({ ...MockUser, password: "hashedPassword" })
        );
      passwordService = mock<PasswordService>();
      jwtService = mock<JwtService>();

      // authService = new AuthService(userService, passwordService, jwtService);
    });
    it("should return userInfo object for correct username and password", async () => {
      passwordService.compare.mockReturnValue(Promise.resolve(true));
      jwtService.signAsync.mockReturnValue(Promise.resolve(signToken));
      const loginResult = await service.login(validCredentials);
      expect(loginResult).toBe({
        username: validCredentials.username,
        roles: MockUser.roles,
        accessToken: signToken,
      });
    });
  });
});
//TODO not ready
