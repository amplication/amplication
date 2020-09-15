import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';

const EXAMPLE_PASSWORD = 'examplePassword';
const EXAMPLE_HASHED_PASSWORD = 'exampleHashedPassword';

const configServiceCompareMock = jest.fn(() => {
  return true;
});
const configServiceHashMock = jest.fn(() => {
  return EXAMPLE_HASHED_PASSWORD;
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
            compare: configServiceCompareMock,
            hash: configServiceHashMock
          }))
        }
      ],
      imports: []
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('should validate a password', () => {
    const args = {
      password: EXAMPLE_PASSWORD,
      hashedPassword: EXAMPLE_HASHED_PASSWORD
    };
    expect(
      service.validatePassword(args.password, args.hashedPassword)
    ).toEqual(true);
  });

  //it('should throw an error', async () => {});
});
