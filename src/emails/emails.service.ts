import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  FetchQueryObject,
  ImapFlow,
  ImapFlowOptions,
  SequenceString,
  FetchMessageObject,
} from 'imapflow';
import * as bcrypt from 'bcrypt';

type IMapClientCache = {
  client: ImapFlow;
  hashedPass: string;
};

@Injectable()
export class EmailsService {
  private clientsCache: { [k in string]: IMapClientCache } = {};

  private saltRounds = 10;

  hashPass(pass) {
    const salt = bcrypt.genSaltSync(this.saltRounds);
    const hash = bcrypt.hashSync(pass, salt);
    return hash;
  }

  /**
   * Create new IMAP client and store it for later access
   */
  async createClient(config: ImapFlowOptions) {
    const { user, pass } = config.auth;
    if (!!this.clientsCache[user]) return this.getClient(config.auth);

    const client = new ImapFlow(config);
    try {
      await client.connect();
    } catch (err) {
      if (err.serverResponseCode === 'AUTHENTICATIONFAILED')
        throw new UnauthorizedException(err.responseText);
    }

    const clientCache = {
      hashedPass: this.hashPass(pass),
      client: client,
    } as IMapClientCache;
    this.clientsCache[user] = clientCache;

    return client;
  }

  /**
   * Check if imap client has been initialized already
   * Verify authentication and return initialized client
   */
  getClient({ user, pass }: { user: string; pass: string }) {
    const { client, hashedPass } = this.clientsCache[user];
    if (!client) throw new Error('IMap client not yet initialized.');

    if (!bcrypt.compareSync(pass, hashedPass)) {
      delete this.clientsCache[user];
      throw new UnauthorizedException(
        'Email Password incorrect, please try again.',
      );
    }
    return client;
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
