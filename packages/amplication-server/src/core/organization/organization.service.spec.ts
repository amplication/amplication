import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { OrganizationService } from './organization.service';
import { PrismaService } from 'src/services/prisma.service';
import { PasswordService } from '../account/password.service';
import { UserService } from '../user/user.service';
import { AccountService } from '../account/account.service';

describe('OrganizationService', () => {
  let service: OrganizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationService,
        PrismaService,
        PasswordService,
        AccountService,
        UserService,
        ConfigService
      ]
    }).compile();

    service = module.get<OrganizationService>(OrganizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
