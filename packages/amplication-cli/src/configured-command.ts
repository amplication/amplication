import fetch from 'cross-fetch';
import { Command } from '@oclif/command';
import * as fs from 'fs';
import * as path from 'path';
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

export abstract class ConfiguredCommand extends Command {
  client = new ApolloClient({
    cache: new InMemoryCache(),
  });

  constructor(...args: [any, any]) {
    super(...args);

    if (!fs.existsSync(this.config.configDir))
      fs.mkdirSync(this.config.configDir, { recursive: true });

    if (fs.existsSync(this.configFilePath))
      this.configJSON = require(this.configFilePath);

    const httpLink = createHttpLink({
      uri: 'http://localhost:3000/graphql',
      fetch,
    });

    const authLink = setContext((_, { headers }) => {
      // get the authentication token from config if it exists
      const token = this.getConfig('token');
      // return the headers to the context so httpLink can read them
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : '',
        },
      };
    });

    this.client.setLink(authLink.concat(httpLink));
  }

  configJSON: Record<string, any> = {
    asd: 'dsa',
  };

  configChanged = false;

  configFilePath = path.join(this.config.configDir, 'config.json');

  setConfig(key: string, value: any) {
    this.configChanged = true;
    this.configJSON[key] = value;
  }

  getConfig(key: string) {
    return this.configJSON[key];
  }

  abstract command(): Promise<void>;

  async preRun() {}

  async run() {
    await this.preRun();
    await this.command();
    await this.postRun();
  }

  async postRun() {
    if (this.configChanged)
      fs.writeFileSync(this.configFilePath, JSON.stringify(this.configJSON));
  }
}
