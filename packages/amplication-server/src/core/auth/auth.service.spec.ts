import { Test, TestingModule } from '@nestjs/testing';
import { Account, Organization, User, UserRole } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'nestjs-prisma';
import { Role } from 'src/enums/Role';
import { AccountService } from '../account/account.service';
import { PasswordService } from '../account/password.service';
import { UserService } from '../user/user.service';
import { AuthService, AuthUser } from './auth.service';
import { OrganizationService } from '../organization/organization.service';
import { EnumTokenType } from './dto';
const EXAMPLE_TOKEN = 'EXAMPLE TOKEN';

const EXAMPLE_ACCOUNT: Account = {
  id: 'alice',
  email: 'alice@example.com',
  password: 'PASSWORD',
  firstName: 'Alice',
  lastName: 'Appleseed',
  createdAt: new Date(),
  updatedAt: new Date(),
  currentUserId: null,
  githubId: null
};

const EXAMPLE_HASHED_PASSWORD = 'HASHED PASSWORD';
const EXAMPLE_NEW_PASSWORD = 'NEW PASSWORD';
const EXAMPLE_NEW_HASHED_PASSWORD = 'NEW HASHED PASSWORD';

const EXAMPLE_ORGANIZATION_ID = 'EXAMPLE_ORGANIZATION_ID';

const EXAMPLE_USER: User = {
  id: 'exampleUser',
  createdAt: new Date(),
  updatedAt: new Date(),
  accountId: EXAMPLE_ACCOUNT.id,
  organizationId: EXAMPLE_ORGANIZATION_ID
};

const EXAMPLE_ORGANIZATION: Organization & { users: User[] } = {
  id: EXAMPLE_ORGANIZATION_ID,
  name: 'Example Organization',
  defaultTimeZone: '',
  address: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  users: [EXAMPLE_USER]
};

const EXAMPLE_OTHER_ORGANIZATION: Organization = {
  id: 'exampleOtherOrganization',
  name: 'Example Other Organization',
  defaultTimeZone: '',
  address: '',
  createdAt: new Date(),
  updatedAt: new Date()
};

const EXAMPLE_USER_ROLE: UserRole = {
  id: 'admin',
  role: Role.Admin,
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: EXAMPLE_USER.id
};

const EXAMPLE_OTHER_USER: User = {
  id: 'exampleOtherUser',
  createdAt: new Date(),
  updatedAt: new Date(),
  accountId: EXAMPLE_ACCOUNT.id,
  organizationId: EXAMPLE_ORGANIZATION.id
};

const EXAMPLE_OTHER_USER_ROLE: UserRole = {
  id: 'otherAdmin',
  role: Role.Admin,
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: EXAMPLE_OTHER_USER.id
};

const EXAMPLE_AUTH_USER: AuthUser = {
  ...EXAMPLE_USER,
  userRoles: [EXAMPLE_USER_ROLE],
  organization: EXAMPLE_ORGANIZATION,
  account: EXAMPLE_ACCOUNT
};

const EXAMPLE_OTHER_AUTH_USER: AuthUser = {
  ...EXAMPLE_OTHER_USER,
  userRoles: [EXAMPLE_OTHER_USER_ROLE],
  organization: EXAMPLE_OTHER_ORGANIZATION,
  account: EXAMPLE_ACCOUNT
};

const EXAMPLE_ACCOUNT_WITH_CURRENT_USER: Account & { currentUser: User } = {
  ...EXAMPLE_ACCOUNT,
  currentUser: EXAMPLE_USER
};

const EXAMPLE_ACCOUNT_WITH_CURRENT_USER_WITH_ROLES_AND_ORGANIZATION: Account & {
  currentUser: AuthUser;
} = {
  ...EXAMPLE_ACCOUNT,
  currentUser: EXAMPLE_AUTH_USER
};

const signMock = jest.fn(() => EXAMPLE_TOKEN);

const createAccountMock = jest.fn(() => EXAMPLE_ACCOUNT);

const setCurrentUserMock = jest.fn(() => EXAMPLE_ACCOUNT_WITH_CURRENT_USER);

const prismaAccountFindOneMock = jest.fn(() => {
  return EXAMPLE_ACCOUNT_WITH_CURRENT_USER_WITH_ROLES_AND_ORGANIZATION;
});

const setPasswordMock = jest.fn();

const hashPasswordMock = jest.fn(password => {
  switch (password) {
    case EXAMPLE_ACCOUNT.password:
      return EXAMPLE_HASHED_PASSWORD;
    case EXAMPLE_NEW_PASSWORD:
      return EXAMPLE_NEW_HASHED_PASSWORD;
  }
  throw new Error(`Unexpected password: "${password}"`);
});

const validatePasswordMock = jest.fn(() => true);

const findUsersMock = jest.fn(() => [EXAMPLE_OTHER_AUTH_USER]);

const createOrganizationMock = jest.fn(() => ({
  ...EXAMPLE_ORGANIZATION,
  users: [EXAMPLE_AUTH_USER]
}));

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    signMock.mockClear();
    createAccountMock.mockClear();
    setCurrentUserMock.mockClear();
    prismaAccountFindOneMock.mockClear();
    setPasswordMock.mockClear();
    hashPasswordMock.mockClear();
    validatePasswordMock.mockClear();
    findUsersMock.mockClear();
    createOrganizationMock.mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AccountService,
          useClass: jest.fn(() => ({
            createAccount: createAccountMock,
            setCurrentUser: setCurrentUserMock,
            setPassword: setPasswordMock
          }))
        },
        {
          provide: PasswordService,
          useClass: jest.fn(() => ({
            hashPassword: hashPasswordMock,
            validatePassword: validatePasswordMock
          }))
        },
        {
          provide: UserService,
          useClass: jest.fn(() => ({
            findUsers: findUsersMock
          }))
        },
        {
          provide: OrganizationService,
          useClass: jest.fn(() => ({
            createOrganization: createOrganizationMock
          }))
        },
        {
          provide: JwtService,
          useClass: jest.fn(() => ({
            sign: signMock
          }))
        },
        {
          provide: PrismaService,
          useClass: jest.fn(() => ({
            account: {
              findUnique: prismaAccountFindOneMock
            }
          }))
        },
        AuthService
      ],
      imports: []
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('sign ups for correct data', async () => {
    const result = await service.signup({
      email: EXAMPLE_ACCOUNT.email,
      password: EXAMPLE_ACCOUNT.password,
      firstName: EXAMPLE_ACCOUNT.firstName,
      lastName: EXAMPLE_ACCOUNT.lastName,
      organizationName: EXAMPLE_ORGANIZATION.name,
      defaultTimeZone: EXAMPLE_ORGANIZATION.defaultTimeZone,
      address: EXAMPLE_ORGANIZATION.address
    });
    expect(result).toBe(EXAMPLE_TOKEN);
    expect(createAccountMock).toHaveBeenCalledTimes(1);
    expect(createAccountMock).toHaveBeenCalledWith({
      data: {
        email: EXAMPLE_ACCOUNT.email,
        password: EXAMPLE_HASHED_PASSWORD,
        firstName: EXAMPLE_ACCOUNT.firstName,
        lastName: EXAMPLE_ACCOUNT.lastName
      }
    });
    expect(setCurrentUserMock).toHaveBeenCalledTimes(1);
    expect(setCurrentUserMock).toHaveBeenCalledWith(
      EXAMPLE_ACCOUNT.id,
      EXAMPLE_USER.id
    );
    expect(hashPasswordMock).toHaveBeenCalledTimes(1);
    expect(hashPasswordMock).toHaveBeenCalledWith(EXAMPLE_ACCOUNT.password);
    expect(createOrganizationMock).toHaveBeenCalledTimes(1);
    expect(createOrganizationMock).toHaveBeenCalledWith(EXAMPLE_ACCOUNT.id, {
      data: {
        name: EXAMPLE_ORGANIZATION.name,
        defaultTimeZone: EXAMPLE_ORGANIZATION.defaultTimeZone,
        address: EXAMPLE_ORGANIZATION.address
      },
      include: {
        users: {
          include: {
            account: true,
            userRoles: true,
            organization: true
          }
        }
      }
    });
    expect(signMock).toHaveBeenCalledTimes(1);
    expect(signMock).toHaveBeenCalledWith({
      accountId: EXAMPLE_ACCOUNT.id,
      organizationId: EXAMPLE_ORGANIZATION.id,
      roles: [EXAMPLE_USER_ROLE.role],
      userId: EXAMPLE_USER.id,
      type: EnumTokenType.User
    });
  });

  it('login for existing user', async () => {
    const result = await service.login(
      EXAMPLE_ACCOUNT.email,
      EXAMPLE_ACCOUNT.password
    );
    expect(result).toBe(EXAMPLE_TOKEN);
    expect(prismaAccountFindOneMock).toHaveBeenCalledTimes(1);
    expect(prismaAccountFindOneMock).toHaveBeenCalledWith({
      where: {
        email: EXAMPLE_ACCOUNT.email
      },
      include: {
        currentUser: {
          include: { account: true, organization: true, userRoles: true }
        }
      }
    });
    expect(validatePasswordMock).toHaveBeenCalledTimes(1);
    expect(validatePasswordMock).toHaveBeenCalledWith(
      EXAMPLE_ACCOUNT.password,
      EXAMPLE_ACCOUNT.password
    );
    expect(signMock).toHaveBeenCalledTimes(1);
    expect(signMock).toHaveBeenCalledWith({
      accountId: EXAMPLE_ACCOUNT.id,
      organizationId: EXAMPLE_ORGANIZATION.id,
      roles: [EXAMPLE_USER_ROLE.role],
      userId: EXAMPLE_USER.id,
      type: EnumTokenType.User
    });
  });

  it('sets current organization for existing user and existing organization', async () => {
    const result = await service.setCurrentOrganization(
      EXAMPLE_ACCOUNT.id,
      EXAMPLE_OTHER_ORGANIZATION.id
    );
    expect(result).toBe(EXAMPLE_TOKEN);
    expect(findUsersMock).toHaveBeenCalledTimes(1);
    expect(findUsersMock).toHaveBeenCalledWith({
      where: {
        organization: {
          id: EXAMPLE_OTHER_ORGANIZATION.id
        },
        account: {
          id: EXAMPLE_ACCOUNT.id
        }
      },
      include: {
        account: true,
        organization: true,
        userRoles: true
      },
      take: 1
    });
    expect(setCurrentUserMock).toHaveBeenCalledTimes(1);
    expect(setCurrentUserMock).toHaveBeenCalledWith(
      EXAMPLE_ACCOUNT.id,
      EXAMPLE_OTHER_AUTH_USER.id
    );
    expect(signMock).toHaveBeenCalledTimes(1);
    expect(signMock).toHaveBeenCalledWith({
      accountId: EXAMPLE_ACCOUNT.id,
      organizationId: EXAMPLE_OTHER_ORGANIZATION.id,
      roles: [EXAMPLE_USER_ROLE.role],
      userId: EXAMPLE_OTHER_AUTH_USER.id,
      type: EnumTokenType.User
    });
  });

  it('changes password for existing account', async () => {
    await service.changePassword(
      EXAMPLE_ACCOUNT,
      EXAMPLE_ACCOUNT.password,
      EXAMPLE_NEW_PASSWORD
    );
    expect(validatePasswordMock).toHaveBeenCalledTimes(1);
    expect(validatePasswordMock).toHaveBeenCalledWith(
      EXAMPLE_ACCOUNT.password,
      EXAMPLE_ACCOUNT.password
    );
    expect(hashPasswordMock).toHaveBeenCalledTimes(1);
    expect(hashPasswordMock).toHaveBeenCalledWith(EXAMPLE_NEW_PASSWORD);
    expect(setPasswordMock).toHaveBeenCalledTimes(1);
    expect(setPasswordMock).toHaveBeenCalledWith(
      EXAMPLE_ACCOUNT.id,
      EXAMPLE_NEW_HASHED_PASSWORD
    );
  });
});
