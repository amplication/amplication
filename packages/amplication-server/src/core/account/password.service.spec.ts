/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';
import * as bcrypt from 'bcrypt';

const EXAMPLE_PASSWORD = 'examplePassword';
const EXAMPLE_HASHED_PASSWORD = 'exampleHashedPassword';

const EXAMPLE_SALTORROUND_NUMBER = 1;

const configServiceGetMock = jest.fn(() => {
  return EXAMPLE_SALTORROUND_NUMBER;
});

jest.mock('bcrypt');
//@ts-ignore
bcrypt.hash.mockImplementation(() => {
  return EXAMPLE_HASHED_PASSWORD;
});
//@ts-ignore
bcrypt.compare.mockImplementation(() => {
  return true;
});

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordService,
        {
          provide: ConfigService,
          useClass: jest.fn(() => ({
            get: configServiceGetMock
          }))
        }
      ],
      imports: []
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a Number', () => {
    expect(service.bcryptSaltRounds).toEqual(EXAMPLE_SALTORROUND_NUMBER);
  });

  it('should validate a password', async () => {
    const args = {
      password: EXAMPLE_PASSWORD,
      hashedPassword: EXAMPLE_HASHED_PASSWORD
    };
    expect(
      await service.validatePassword(args.password, args.hashedPassword)
    ).toEqual(true);
  });

  it('should hash a password', async () => {
    expect(await service.hashPassword(EXAMPLE_PASSWORD)).toEqual(
      EXAMPLE_HASHED_PASSWORD
    );
  });

  it('should generate a password', () => {
    expect(service.generatePassword()).toEqual('generateRandomPassword');
  });

  it('should throw an error if saltOrRounds is undefined', async () => {
    const EXAMPLE_ERROR = new Error('saltOrRound is not defined');
    configServiceGetMock.mockImplementation(() => undefined);
    expect(() => service.bcryptSaltRounds).toThrow(EXAMPLE_ERROR);
  });
});
