import { Client } from "discord.js";

export default class {
  client: Client;

  constructor(client) {
    this.client = client;
  }

  run() {
    return console.log(`Bot iniciado com ${this.client.users.cache.size} usuários.`);
  }
}