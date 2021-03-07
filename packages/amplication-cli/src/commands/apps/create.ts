import cli from 'cli-ux';
import { ConfiguredCommand } from '../../configured-command';
import chalk from 'chalk';
import { createApp } from '../../api';

export default class Login extends ConfiguredCommand {
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
    const { args } = this.parse(Login);

    const name = args.name;
    const description = args.description;

    cli.action.start(`Creating new app ${chalk.green.bold(name)} `);

    const data = await createApp(this.client, name, description);

    cli.action.stop();
    cli.styledJSON(data);
  }
}
