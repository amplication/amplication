import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'src/services/prisma.service';
import { User } from 'src/models';

const EXAMPLE_USER_ID = 'exampleUserId';

const EXAMPLE_USER: User = {
  id: EXAMPLE_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date()
};

const prismaUserFindOneMock = jest.fn(() => {
  return EXAMPLE_USER;
});

const prismaUserFindManyMock = jest.fn(() => {
  return [EXAMPLE_USER];
});

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useClass: jest.fn().mockImplementation(() => ({
            user: {
              findOne: prismaUserFindOneMock,
              findMany: prismaUserFindManyMock
            }
          }))
        }
      ]
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find one', async () => {
    expect(await service.findUser({ where: { id: EXAMPLE_USER_ID } })).toEqual(
      EXAMPLE_USER
    );
  });

  it('should find many', async () => {
    expect(await service.findUsers({ where: {} })).toEqual([EXAMPLE_USER]);
  });
});
