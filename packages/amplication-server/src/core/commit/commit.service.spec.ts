import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { Commit } from 'src/models';
import { CommitService } from './commit.service';
import { EntityService } from '../entity/entity.service';

const EXAMPLE_COMMIT_ID = 'exampleCommitId';
const EXAMPLE_USER_ID = 'exampleUserId';
const EXAMPLE_MESSAGE = 'exampleMessage';

const EXAMPLE_COMMIT: Commit = {
  id: EXAMPLE_COMMIT_ID,
  userId: EXAMPLE_USER_ID,
  message: EXAMPLE_MESSAGE,
  createdAt: new Date()
};

const prismaCommitFindOneMock = jest.fn(() => EXAMPLE_COMMIT);
const prismaCommitFindManyMock = jest.fn(() => [EXAMPLE_COMMIT]);

describe('CommitService', () => {
  let service: CommitService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: PrismaService,
          useClass: jest.fn(() => ({
            commit: {
              findUnique: prismaCommitFindOneMock,
              findMany: prismaCommitFindManyMock
            }
          }))
        },
        {
          provide: EntityService,
          useValue: {}
        },
        CommitService
      ]
    }).compile();

    service = module.get<CommitService>(CommitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find one Commit', async () => {
    const args = { where: { id: EXAMPLE_COMMIT_ID } };
    expect(await service.findOne(args)).toEqual(EXAMPLE_COMMIT);
    expect(prismaCommitFindOneMock).toBeCalledTimes(1);
    expect(prismaCommitFindOneMock).toBeCalledWith(args);
  });

  it('should find many Commits', async () => {
    const args = {};
    expect(await service.findMany(args)).toEqual([EXAMPLE_COMMIT]);
    expect(prismaCommitFindManyMock).toBeCalledTimes(1);
    expect(prismaCommitFindManyMock).toBeCalledWith(args);
  });
});
