import cli, { Table } from "cli-ux";
import fetch from "cross-fetch";
import { Command } from "@oclif/command";
import * as fs from "fs";
import * as path from "path";
import urlJoin from "url-join";

import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";
import { AMP_SERVER_URL, DEFAULT_SERVER_URL } from "./properties";

import {
  OUTPUT_FORMAT_STYLED_JSON,
  OUTPUT_FORMAT_TABLE,
} from "./flags/format-flag";

export abstract class ConfiguredCommand extends Command {
  client = new ApolloClient({
    cache: new InMemoryCache(),
  });

  configJSON: Record<string, any> = {};

  configChanged = false;

  configFilePath = path.join(this.config.configDir, "config.json");

  constructor(...args: [any, any]) {
    super(...args);

    if (!fs.existsSync(this.config.configDir))
      fs.mkdirSync(this.config.configDir, { recursive: true });

    if (fs.existsSync(this.configFilePath))
      this.configJSON = require(this.configFilePath);

    let serverUrl = this.configJSON[AMP_SERVER_URL];
    if (!serverUrl) {
      serverUrl = DEFAULT_SERVER_URL;
      this.setConfig(AMP_SERVER_URL, DEFAULT_SERVER_URL);
    }

    serverUrl = urlJoin(serverUrl, "graphql");
    const httpLink = createHttpLink({
      uri: serverUrl,
      fetch,
    });

    const authLink = setContext((_, { headers }) => {
      // get the authentication token from config if it exists
      const token = this.getConfig("token");
      // return the headers to the context so httpLink can read them
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        },
      };
    });

    this.client.setLink(authLink.concat(httpLink));
  }

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

  output(data: any, flags: any, tableColumns: Table.table.Columns<any>) {
    switch (flags.format) {
      case OUTPUT_FORMAT_STYLED_JSON:
        cli.styledJSON(data);
        break;
      case OUTPUT_FORMAT_TABLE:
        cli.table(Array.isArray(data) ? data : [data], tableColumns || {}, {
          printLine: this.log,
          ...flags, // parsed flags
        });
        break;

      default:
        this.log(JSON.stringify(data));
        break;
    }
  }
}
