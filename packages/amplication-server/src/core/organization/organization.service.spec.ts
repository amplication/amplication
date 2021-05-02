import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { OrganizationService } from './organization.service';
import { PrismaService } from 'nestjs-prisma';
import { PasswordService } from '../account/password.service';
import { UserService } from '../user/user.service';
import { AccountService } from '../account/account.service';
import { AppService } from '../app/app.service';
import { Organization, Account, User } from 'src/models';
import { Role } from 'src/enums/Role';

const EXAMPLE_ORGANIZATION_ID = 'exampleOrganizationId';
const EXAMPLE_ORGANIZATION_NAME = 'exampleOrganizationName';
const EXAMPLE_TIME_ZONE = 'exampleTimeZone';
const EXAMPLE_ADDRESS = 'exampleAddress';

const EXAMPLE_ACCOUNT_ID = 'exampleAccountId';
const EXAMPLE_EMAIL = 'exampleEmail';
const EXAMPLE_FIRST_NAME = 'exampleFirstName';
const EXAMPLE_LAST_NAME = 'exampleLastName';
const EXAMPLE_PASSWORD = 'examplePassword';

const EXAMPLE_NONEXISTING_EMAIL = 'exampleNonexistingEmail';

const EXAMPLE_USER_ID = 'exampleUserId';

const EXAMPLE_NEW_PASSWORD = 'exampleNewPassword';

const EXAMPLE_ACCOUNT: Account = {
  id: EXAMPLE_ACCOUNT_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  email: EXAMPLE_EMAIL,
  firstName: EXAMPLE_FIRST_NAME,
  lastName: EXAMPLE_LAST_NAME,
  password: EXAMPLE_PASSWORD
};

const EXAMPLE_USER: User = {
  id: EXAMPLE_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  account: EXAMPLE_ACCOUNT
};

const EXAMPLE_ORGANIZATION: Organization = {
  id: EXAMPLE_ORGANIZATION_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: EXAMPLE_ORGANIZATION_NAME,
  defaultTimeZone: EXAMPLE_TIME_ZONE,
  address: EXAMPLE_ADDRESS,
  users: [EXAMPLE_USER]
};

EXAMPLE_USER.organization = EXAMPLE_ORGANIZATION;

const prismaOrganizationFindOneMock = jest.fn(() => {
  return EXAMPLE_ORGANIZATION;
});
const prismaOrganizationFindManyMock = jest.fn(() => {
  return [EXAMPLE_ORGANIZATION];
});
const prismaOrganizationDeleteMock = jest.fn(() => {
  return EXAMPLE_ORGANIZATION;
});
const prismaOrganizationUpdateMock = jest.fn(() => {
  return EXAMPLE_ORGANIZATION;
});
const prismaOrganizationCreateMock = jest.fn(() => {
  return EXAMPLE_ORGANIZATION;
});
const prismaUserFindManyMock = jest.fn(() => {
  return [EXAMPLE_USER];
});
const prismaUserCreateMock = jest.fn(() => {
  return EXAMPLE_USER;
});
const accountServiceFindAccountMock = jest.fn(() => {
  return EXAMPLE_ACCOUNT;
});
const accountServiceCreateAccountMock = jest.fn(() => {
  return EXAMPLE_ACCOUNT;
});
const passwordServiceGeneratePasswordMock = jest.fn(() => {
  return EXAMPLE_NEW_PASSWORD;
});
const passwordServiceHashPasswordMock = jest.fn(() => {
  return EXAMPLE_NEW_PASSWORD;
});

const appCreateSampleAppMock = jest.fn();

describe('OrganizationService', () => {
  let service: OrganizationService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationService,
        UserService,
        ConfigService,
        {
          provide: PrismaService,
          useClass: jest.fn().mockImplementation(() => ({
            organization: {
              findUnique: prismaOrganizationFindOneMock,
              findMany: prismaOrganizationFindManyMock,
              delete: prismaOrganizationDeleteMock,
              update: prismaOrganizationUpdateMock,
              create: prismaOrganizationCreateMock
            },
            user: {
              findMany: prismaUserFindManyMock,
              create: prismaUserCreateMock
            }
          }))
        },
        {
          provide: AppService,
          useClass: jest.fn().mockImplementation(() => ({
            createSampleApp: appCreateSampleAppMock
          }))
        },
        {
          provide: AccountService,
          useClass: jest.fn().mockImplementation(() => ({
            findAccount: accountServiceFindAccountMock,
            createAccount: accountServiceCreateAccountMock
          }))
        },
        {
          provide: PasswordService,
          useClass: jest.fn().mockImplementation(() => ({
            generatePassword: passwordServiceGeneratePasswordMock,
            hashPassword: passwordServiceHashPasswordMock
          }))
        }
      ]
    }).compile();

    service = module.get<OrganizationService>(OrganizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find one organization', async () => {
    const args = { where: { id: EXAMPLE_ORGANIZATION_ID } };
    expect(await service.getOrganization(args)).toEqual(EXAMPLE_ORGANIZATION);
    expect(prismaOrganizationFindOneMock).toBeCalledTimes(1);
    expect(prismaOrganizationFindOneMock).toBeCalledWith(args);
  });

  it('should find many organizations', async () => {
    const args = { where: { id: EXAMPLE_ORGANIZATION_ID } };
    expect(await service.getOrganizations(args)).toEqual([
      EXAMPLE_ORGANIZATION
    ]);
    expect(prismaOrganizationFindManyMock).toBeCalledTimes(1);
    expect(prismaOrganizationFindManyMock).toBeCalledWith(args);
  });

  it('should delete an organization', async () => {
    const args = { where: { id: EXAMPLE_ORGANIZATION_ID } };
    expect(await service.deleteOrganization(args)).toEqual(
      EXAMPLE_ORGANIZATION
    );
    expect(prismaOrganizationDeleteMock).toBeCalledTimes(1);
    expect(prismaOrganizationDeleteMock).toBeCalledWith(args);
  });

  it('should update an organization', async () => {
    const args = {
      data: {},
      where: { id: EXAMPLE_ORGANIZATION_ID }
    };
    expect(await service.updateOrganization(args)).toEqual(
      EXAMPLE_ORGANIZATION
    );
    expect(prismaOrganizationUpdateMock).toBeCalledTimes(1);
    expect(prismaOrganizationUpdateMock).toBeCalledWith(args);
  });

  it('should create an organization', async () => {
    const args = {
      accountId: EXAMPLE_ACCOUNT_ID,
      args: {
        data: {
          name: EXAMPLE_ORGANIZATION_NAME,
          defaultTimeZone: EXAMPLE_TIME_ZONE,
          address: EXAMPLE_ADDRESS
        }
      }
    };
    const prismaArgs = {
      ...args.args,
      data: {
        ...args.args.data,
        users: {
          create: {
            account: { connect: { id: args.accountId } },
            userRoles: {
              create: {
                role: Role.OrganizationAdmin
              }
            }
          }
        }
      },
      include: {
        users: true
      }
    };
    expect(await service.createOrganization(args.accountId, args.args)).toEqual(
      EXAMPLE_ORGANIZATION
    );
    expect(prismaOrganizationCreateMock).toBeCalledTimes(1);
    expect(prismaOrganizationCreateMock).toBeCalledWith(prismaArgs);
  });

  /**@todo fix test*/
  it.skip('should throw conflict exception if invited user is already in the organization', async () => {
    const functionArgs = {
      currentUser: EXAMPLE_USER,
      args: { data: { email: EXAMPLE_EMAIL } }
    };
    const accountArgs = {
      where: { email: EXAMPLE_EMAIL }
    };

    await expect(
      service.inviteUser(functionArgs.currentUser, functionArgs.args)
    ).rejects.toThrow(
      `User with email ${functionArgs.args.data.email} already exist in the organization.`
    );
    expect(accountServiceFindAccountMock).toBeCalledTimes(1);
    expect(accountServiceFindAccountMock).toBeCalledWith(accountArgs);
    /**@todo test prisma user calls */
    // expect(prismaUserFindManyMock).toBeCalledTimes(1);
    // expect(prismaUserFindManyMock).toBeCalledWith(existingUsersArgs);
  });
  /**@todo fix test */
  it.skip('should create an account and invite user to organization', async () => {
    accountServiceFindAccountMock.mockImplementation(() => null);

    const functionArgs = {
      currentUser: EXAMPLE_USER,
      args: { data: { email: EXAMPLE_NONEXISTING_EMAIL } }
    };
    const accountArgs = {
      where: { email: EXAMPLE_NONEXISTING_EMAIL }
    };
    const userCreateArgs = {
      data: {
        organization: { connect: { id: EXAMPLE_ORGANIZATION_ID } },
        account: { connect: { id: EXAMPLE_ACCOUNT_ID } }
      }
    };
    const createAccountArgs = {
      data: {
        firstName: '',
        lastName: '',
        email: functionArgs.args.data.email,
        password: EXAMPLE_NEW_PASSWORD
      }
    };
    expect(
      await service.inviteUser(functionArgs.currentUser, functionArgs.args)
    ).toEqual(EXAMPLE_USER);
    expect(accountServiceFindAccountMock).toBeCalledTimes(1);
    expect(accountServiceFindAccountMock).toBeCalledWith(accountArgs);
    expect(passwordServiceGeneratePasswordMock).toBeCalledTimes(1);
    expect(passwordServiceGeneratePasswordMock).toBeCalledWith();
    expect(passwordServiceHashPasswordMock).toBeCalledTimes(1);
    expect(passwordServiceHashPasswordMock).toBeCalledWith(
      EXAMPLE_NEW_PASSWORD
    );
    expect(accountServiceCreateAccountMock).toBeCalledTimes(1);
    expect(accountServiceCreateAccountMock).toBeCalledWith(createAccountArgs);
    expect(prismaUserCreateMock).toBeCalledTimes(1);
    expect(prismaUserCreateMock).toBeCalledWith(userCreateArgs);
  });
});
