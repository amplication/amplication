import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from '../account/account.service';
import { PasswordService } from '../account/password.service';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { OrganizationService } from '../organization/organization.service';
import { Account, Organization, User, UserRole } from '@prisma/client';
import { Role } from '../../enums/Role';

type UserWithRoles = User & { userRoles: UserRole[] };

const EXAMPLE_ACCOUNT: Account = {
  id: 'alice',
  email: 'alice@example.com',
  password: 'PASSWORD',
  firstName: 'Alice',
  lastName: 'Appleseed',
  createdAt: new Date(),
  updatedAt: new Date()
};

const EXAMPLE_HASHED_PASSWORD = 'HASHED PASSWORD';
const EXAMPLE_NEW_PASSWORD = 'NEW PASSWORD';
const EXAMPLE_NEW_HASHED_PASSWORD = 'NEW HASHED PASSWORD';

const EXAMPLE_ORGANIZATION: Organization = {
  id: 'foo',
  name: 'Foo',
  defaultTimeZone: 'GMT-4',
  address: '767 5th Ave, New York, NY 10153, United States',
  createdAt: new Date(),
  updatedAt: new Date()
};

const EXAMPLE_USER: User = {
  id: 'baz',
  createdAt: new Date(),
  updatedAt: new Date()
};

const EXAMPLE_USER_ROLE: UserRole = {
  id: 'admin',
  role: Role.ADMIN,
  createdAt: new Date(),
  updatedAt: new Date()
};

const EXAMPLE_USER_WITH_ROLES: UserWithRoles = {
  ...EXAMPLE_USER,
  userRoles: [EXAMPLE_USER_ROLE]
};

const EXAMPLE_ACCOUNT_WITH_CURRENT_USER: Account & { currentUser: User } = {
  ...EXAMPLE_ACCOUNT,
  currentUser: EXAMPLE_USER
};

const createAccountMock = jest.fn().mockImplementation(() => EXAMPLE_ACCOUNT);
const setCurrentUserMock = jest
  .fn()
  .mockImplementation(() => EXAMPLE_ACCOUNT_WITH_CURRENT_USER);
const findAccountMock = jest.fn().mockImplementation(() => ({
  ...EXAMPLE_ACCOUNT,
  currentUser: {
    ...EXAMPLE_USER_WITH_ROLES,
    organization: EXAMPLE_ORGANIZATION
  }
}));
const setPasswordMock = jest.fn();

const hashPasswordMock = jest.fn().mockImplementation(password => {
  switch (password) {
    case EXAMPLE_ACCOUNT.password:
      return EXAMPLE_HASHED_PASSWORD;
    case EXAMPLE_NEW_PASSWORD:
      return EXAMPLE_NEW_HASHED_PASSWORD;
  }
  throw new Error(`Unexpected password: "${password}"`);
});
const validatePasswordMock = jest.fn().mockImplementation(() => true);

const findUsersMock = jest
  .fn()
  .mockImplementation(() => [EXAMPLE_USER_WITH_ROLES]);

const createOrganizationMock = jest.fn().mockImplementation(() => ({
  ...EXAMPLE_ORGANIZATION,
  users: [EXAMPLE_USER_WITH_ROLES]
}));

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    createAccountMock.mockClear();
    setCurrentUserMock.mockClear();
    findAccountMock.mockClear();
    setPasswordMock.mockClear();
    hashPasswordMock.mockClear();
    validatePasswordMock.mockClear();
    findUsersMock.mockClear();
    createOrganizationMock.mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AccountService,
          useClass: jest.fn().mockImplementation(() => ({
            createAccount: createAccountMock,
            setCurrentUser: setCurrentUserMock,
            findAccount: findAccountMock,
            setPassword: setPasswordMock
          }))
        },
        {
          provide: PasswordService,
          useClass: jest.fn().mockImplementation(() => ({
            hashPassword: hashPasswordMock,
            validatePassword: validatePasswordMock
          }))
        },
        {
          provide: UserService,
          useClass: jest.fn().mockImplementation(() => ({
            findUsers: findUsersMock
          }))
        },
        {
          provide: OrganizationService,
          useClass: jest.fn().mockImplementation(() => ({
            createOrganization: createOrganizationMock
          }))
        },
        AuthService
      ],
      imports: [
        JwtModule.register({
          secretOrPrivateKey: 'dummySecretKey'
        })
      ]
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
    expect(result).not.toBe('');
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
      }
    });
  });

  it('login for existing user', async () => {
    const result = await service.login(
      EXAMPLE_ACCOUNT.email,
      EXAMPLE_ACCOUNT.password
    );
    expect(result).not.toBe('');
    expect(findAccountMock).toHaveBeenCalledTimes(1);
    expect(findAccountMock).toHaveBeenCalledWith({
      where: {
        email: EXAMPLE_ACCOUNT.email
      },
      include: {
        currentUser: { include: { organization: true, userRoles: true } }
      }
    });
    expect(validatePasswordMock).toHaveBeenCalledTimes(1);
    expect(validatePasswordMock).toHaveBeenCalledWith(
      EXAMPLE_ACCOUNT.password,
      EXAMPLE_ACCOUNT.password
    );
  });

  it('sets current organization for existing user and existing organization', async () => {
    const result = await service.setCurrentOrganization(
      EXAMPLE_ACCOUNT.id,
      EXAMPLE_ORGANIZATION.id
    );
    expect(result).not.toBe('');
    expect(findUsersMock).toHaveBeenCalledTimes(1);
    expect(findUsersMock).toHaveBeenCalledWith({
      where: {
        organization: {
          id: EXAMPLE_ORGANIZATION.id
        },
        account: {
          id: EXAMPLE_ACCOUNT.id
        }
      },
      include: {
        userRoles: true
      },
      first: 1
    });
    expect(setCurrentUserMock).toHaveBeenCalledTimes(1);
    expect(setCurrentUserMock).toHaveBeenCalledWith(
      EXAMPLE_ACCOUNT.id,
      EXAMPLE_USER.id
    );
  });

  it('changes password for existing account', async () => {
    await service.changePassword(EXAMPLE_ACCOUNT.id, EXAMPLE_ACCOUNT.password, {
      oldPassword: EXAMPLE_ACCOUNT.password,
      newPassword: EXAMPLE_NEW_PASSWORD
    });
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
