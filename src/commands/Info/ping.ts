import { Client, Message } from "discord.js";


export class ping {
  client: Client;

  constructor(client) {
    this.client = client;
  }

  run(message: Message, args: Array<string>) {
    message.reply(`minha latência é **${this.client.ws.ping}ms**`);
  }
}

export const props = {
  info: {
    name: 'ping',
  },
  config: {
    category: 'Info',
  }
}