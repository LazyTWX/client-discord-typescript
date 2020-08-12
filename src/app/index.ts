import { Client, Collection } from 'discord.js';

import config from '../config/config';

import { readdirSync } from 'fs';
import { Interface } from 'readline';

interface InterfaceProps {
  info: {
    name: string,
    description?: string,
  },
  config: {
    aliases: Array<string>;
    permissions?: Array<string>;
    category: string;
  }
}

export default class ClientApplication extends Client {
  commands: Collection<string, InterfaceProps>;
  aliases: Collection<string, string>;

  constructor() {
    super();

    this.initializeApplication();
    this.commandsLoad();
    this.eventsLoad();

    this.commands = new Collection();
    this.aliases = new Collection();
  }

  initializeApplication() {
    return super.login(config.tokenClient);
  }

  async commandsLoad(): Promise<void> {
    readdirSync('./src/Commands').forEach((file: string) => {
      readdirSync('./src/Commands/' + file).forEach(async (subFile: string) => {
        if(!subFile.endsWith('.ts')) return;

        const commandProps = (await import(`../Commands/${file}/${subFile}`));
        const props: InterfaceProps = commandProps.props;

        this.commands.set(props.info.name, props);

        if(props.config && props.config.aliases) {
          for(let index = 0; index < props.config.aliases.length; index++) {
            this.aliases.set(props.config.aliases[index], props.info.name);
          }
        }
      });
    });
  }

  async eventsLoad(): Promise<void> {
    readdirSync('./src/events').forEach(async (file: string) => {
      if(!file.endsWith('.ts')) return;

      const eventFile = (await import(`../events/${file}`)).default;
      const event = new eventFile(this);

      const eventName = file.split('.ts')[0];

      try {
        super.on(eventName, (...args) => event.run(...args));
      } catch(e) { 
        console.log(e);
      }

    });
  }
}