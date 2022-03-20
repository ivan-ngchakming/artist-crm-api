import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ImapFlow } from 'imapflow';
import { EmailsService } from './emails.service';

const mockClient = {
  connect: jest.fn(),
};

jest.mock('imapflow', () => {
  return {
    ImapFlow: jest.fn().mockImplementation(() => {
      return mockClient;
    }),
  };
});

const imapflowConfig = {
  host: 'host',
  port: 1234,
  auth: {
    user: 'user@gmail.com',
    pass: 'userpassword',
  },
};

describe('EmailsService', () => {
  let service: EmailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailsService],
    }).compile();

    service = module.get<EmailsService>(EmailsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create imap client', async () => {
    const client = await service.createClient(imapflowConfig);
    expect(ImapFlow).toHaveBeenCalledWith(imapflowConfig);
    expect(client).toEqual(mockClient);
    expect(mockClient.connect).toHaveBeenCalledTimes(1);
  });

  it('should return created client from previous call', async () => {
    const client = await service.createClient(imapflowConfig);
    const client2 = await service.createClient(imapflowConfig);
    expect(client2).toEqual(client);
    expect(ImapFlow).toHaveBeenCalledTimes(1);
    expect(mockClient.connect).toHaveBeenCalledTimes(1);
  });

  it('should reject unauthorized access to cached imap clients', async () => {
    await service.createClient(imapflowConfig);

    // Create client with same username but different password
    await expect(
      service.createClient({
        ...imapflowConfig,
        auth: {
          ...imapflowConfig.auth,
          pass: 'a_different_pass',
        },
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
