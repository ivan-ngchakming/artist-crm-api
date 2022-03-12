import {
  Controller,
  Param,
  Get,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { EmailsService } from './emails.service';

@Controller('emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  /**
   * Sequelize query string to imapflow FetchQueryObject.
   * TODO: sequelize remaining query params
   */
  sequelizeQuery({ bodyParts: bodyPartsQuery, ...queryParams }: any) {
    let bodyParts = [];
    if (typeof bodyPartsQuery === 'string') {
      bodyParts.push(bodyPartsQuery);
    } else if (bodyPartsQuery) {
      bodyParts = bodyPartsQuery as string[];
    }
    return {
      bodyParts,
      ...queryParams,
    };
  }

  @Get()
  async findAll(@Req() request: Request) {
    const { emailUser, emailPass } = request.cookies;
    const query = this.sequelizeQuery(request.query);

    if (!emailUser || !emailPass) throw new UnauthorizedException();

    return this.emailsService.findAll(
      {
        auth: {
          user: emailUser,
          pass: emailPass,
        },
        host: 'imap.gmail.com',
        port: 993,
        secure: true,
      },
      '1:1',
      query,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() request: Request) {
    const { emailUser, emailPass } = request.cookies;
    const query = this.sequelizeQuery(request.query);

    if (!emailUser || !emailPass) throw new UnauthorizedException();

    return this.emailsService.findOne(
      {
        auth: {
          user: emailUser,
          pass: emailPass,
        },
        host: 'imap.gmail.com',
        port: 993,
        secure: true,
      },
      id,
      query,
    );
  }
}
