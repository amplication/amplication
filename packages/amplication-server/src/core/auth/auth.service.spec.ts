import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from '../account/account.service';
import { PasswordService } from '../account/password.service';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { OrganizationService } from '../organization/organization.service';
import {
  AccountCreateArgs,
  Account,
  OrganizationCreateArgs,
  Organization,
  User,
  FindOneAccountArgs,
  FindManyUserArgs,
  UserRole
} from '@prisma/client';
import { Role } from '../../enums/Role';

type UserWithRoles = User & { userRoles: UserRole[] };

const EXAMPLE_ACCOUNT: Account = {
  id: 'alice',
  email: 'alice@example.com',
  password: 'fooBar1234',
  firstName: 'Alice',
  lastName: 'Appleseed',
  createdAt: new Date(),
  updatedAt: new Date()
};

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

class AccountServiceMock {
  async createAccount(args: AccountCreateArgs): Promise<Account> {
    return EXAMPLE_ACCOUNT;
  }
  async setCurrentUser(
    accountId: string,
    organizationId: string
  ): Promise<Account & { currentUser: User }> {
    return EXAMPLE_ACCOUNT_WITH_CURRENT_USER;
  }
  async findAccount(
    args: FindOneAccountArgs
  ): Promise<
    | (Account & {
        currentUser: UserWithRoles & { organization: Organization };
      })
    | null
  > {
    if (args.where.email === EXAMPLE_ACCOUNT.email) {
      return {
        ...EXAMPLE_ACCOUNT,
        currentUser: {
          ...EXAMPLE_USER_WITH_ROLES,
          organization: EXAMPLE_ORGANIZATION
        }
      };
    }
    return null;
  }
  async setPassword(accountId: string, password: string) {}
}

class OrganizationServiceMock {
  async createOrganization(
    args: OrganizationCreateArgs
  ): Promise<Organization & { users: [UserWithRoles] }> {
    return {
      ...EXAMPLE_ORGANIZATION,
      users: [EXAMPLE_USER_WITH_ROLES]
    };
  }
}

class PasswordServiceMock {
  async hashPassword(password: string): Promise<string> {
    return password;
  }
  async validatePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return password === hashedPassword;
  }
}

class UserServiceMock {
  async findUsers(args: FindManyUserArgs): Promise<User[]> {
    return [EXAMPLE_USER_WITH_ROLES];
  }
}

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AccountService,
          useClass: AccountServiceMock
        },
        {
          provide: PasswordService,
          useClass: PasswordServiceMock
        },
        {
          provide: UserService,
          useClass: UserServiceMock
        },
        {
          provide: OrganizationService,
          useClass: OrganizationServiceMock
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
  });

  it('login for existing user', async () => {
    const result = await service.login(
      EXAMPLE_ACCOUNT.email,
      EXAMPLE_ACCOUNT.password
    );
    expect(result).not.toBe('');
  });

  it('sets current organization for existing user and existing organization', async () => {
    const result = await service.setCurrentOrganization(
      EXAMPLE_ACCOUNT.id,
      EXAMPLE_ORGANIZATION.id
    );
    expect(result).not.toBe('');
  });

  it('changes password for existing account', async () => {
    const result = await service.changePassword(
      EXAMPLE_ACCOUNT.id,
      EXAMPLE_ACCOUNT.password,
      {
        oldPassword: EXAMPLE_ACCOUNT.password,
        newPassword: 'NEW PASSWORD'
      }
    );
  });
});
