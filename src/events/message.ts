import { Message } from "discord.js";
import ClientApplication from "../app";

export default class {
  client: ClientApplication;

  constructor(client) {
    this.client = client;
  }

  async run(message: Message) {
    if(message.author.bot) return;

    if(message.channel.type == 'dm') return;

    if(!message.content.startsWith('/')) return;
    
    const args = message.content.slice('/'.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
    if(cmd) {
      const commandFile = (await import(`../commands/${cmd.config.category}/${cmd.info.name}`));
      const commandExecute = new commandFile[cmd.info.name](this.client);

      try {
        commandExecute.run(message, args);
      } catch(e) {
        console.log(e);
      }
    } else {
      return message.reply('Inexistente.');
    }
  }
}