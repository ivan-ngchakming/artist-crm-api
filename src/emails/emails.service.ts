import { Injectable } from '@nestjs/common';
import { ImapFlow, ImapFlowOptions } from 'imapflow';

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

  /**
   * Return all user's emails
   * TODO: Implement pagination
   */
  async findAll(config: ImapFlowOptions) {
    const client = await this.createClient(config);
    const lock = await client.getMailboxLock('INBOX');

    const messages = [];
    try {
      for await (const message of client.fetch('1:10', {
        flags: true,
        envelope: true,
      })) {
        messages.push({
          id: message.emailId,
          flags: Array.from(message.flags),
          ...message.envelope,
        });
      }
    } finally {
      lock.release();
    }
    return messages;
  }
}
