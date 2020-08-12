import { Test, TestingModule } from '@nestjs/testing';
import { AppRoleService } from './appRole.service';
import { PrismaService } from 'src/services/prisma.service';

describe('AppRoleService', () => {
  let service: AppRoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppRoleService, PrismaService]
    }).compile();

    service = module.get<AppRoleService>(AppRoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
