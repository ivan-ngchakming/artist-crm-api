import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { EmailsService } from './emails.service';

@Controller('emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Get()
  async findAll(@Req() request: Request) {
    const { emailUser, emailPass } = request.cookies;

    if (!emailUser || !emailPass) throw new UnauthorizedException();

    return this.emailsService.findAll({
      auth: {
        user: emailUser,
        pass: emailPass,
      },
      host: 'imap.gmail.com',
      port: 993,
      secure: true,
      logger: false,
    });
  }
}
