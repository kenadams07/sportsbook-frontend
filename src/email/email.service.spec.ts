import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'SMTP_HOST':
                  return 'email-smtp.eu-west-2.amazonaws.com';
                case 'SMTP_PORT':
                  return 587;
                case 'SMTP_USERNAME':
                  return 'test-user';
                case 'SMTP_PASSWORD':
                  return 'test-password';
                case 'SMTP_FROM_MAIL':
                  return 'test@example.com';
                case 'FRONTEND_URL':
                  return 'http://localhost:3000';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add more tests as needed
});