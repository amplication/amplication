import cli from 'cli-ux';
import { ConfiguredCommand } from '../../configured-command';
import chalk from 'chalk';
import { createApp } from '../../api';
import { format } from '../../flags/format-flag';
import { APP_COLUMNS } from './index';

export default class AppsCreate extends ConfiguredCommand {
  static flags = {
    ...cli.table.flags(),
    format: format(),
  };

  static args = [
    {
      name: 'name',
      required: true,
      description: 'name of app to create',
    },
    {
      name: 'description',
      required: false,
      description: 'description of app to create',
    },
  ];

  async command() {
    const { args, flags } = this.parse(AppsCreate);

    const name = args.name;
    const description = args.description;

    cli.action.start(`Creating new app ${chalk.green.bold(name)} `);

    const data = await createApp(this.client, name, description || '');

    cli.action.stop();
    this.output(data, flags, APP_COLUMNS);
  }
}
