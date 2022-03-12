import { Injectable } from '@nestjs/common';
import {
  FetchQueryObject,
  ImapFlow,
  ImapFlowOptions,
  SequenceString,
  FetchMessageObject,
} from 'imapflow';

@Injectable()
export class EmailsService {
  private clients: { [k in string]: ImapFlow } = {};

  /**
   * Create new IMAP client and store it for later access
   */
  async createClient(config: ImapFlowOptions) {
    if (!!this.clients[config.auth.user]) return this.clients[config.auth.user];

    const client = new ImapFlow(config);
    await client.connect();

    this.clients[config.auth.user] = client;
    return client;
  }

  getClient(user: string) {
    return this.clients[user];
  }

  sequelizeFetchMessageObject(dataArg: FetchMessageObject) {
    const data = { ...dataArg };

    for (const key in data) {
      if (typeof data[key] === 'bigint') {
        data[key] = data[key].toString();
      } else if (data[key] instanceof Set) {
        data[key] = Array.from(data[key]);
      }
    }

    if (data.bodyParts) {
      data['bodyPartsDecoded'] = Array.from(data.bodyParts.values()).map(
        (val) => val.toString(),
      );
    }

    return data;
  }

  /**
   * Return all user's emails
   * TODO: Implement pagination
   */
  async findAll(
    config: ImapFlowOptions,
    range: SequenceString,
    fetchOptions?: Partial<FetchQueryObject>,
  ) {
    const client = await this.createClient(config);
    const lock = await client.getMailboxLock('INBOX');

    const messages = [];
    try {
      for await (const message of client.fetch(range, {
        flags: true,
        envelope: true,
        ...fetchOptions,
      })) {
        messages.push(this.sequelizeFetchMessageObject(message));
      }
    } finally {
      lock.release();
    }
    return messages;
  }

  async findOne(
    config: ImapFlowOptions,
    uid: string,
    fetchOptions?: Partial<FetchQueryObject>,
  ) {
    const client = await this.createClient(config);
    const lock = await client.getMailboxLock('INBOX');

    let message;
    try {
      message = await client.fetchOne(
        uid,
        {
          flags: true,
          envelope: true,
          bodyStructure: true,
          ...fetchOptions,
        },
        { uid: true },
      );

      console.log(message);
    } finally {
      lock.release();
    }
    return this.sequelizeFetchMessageObject(message);
  }
}
