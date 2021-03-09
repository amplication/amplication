import cli from 'cli-ux';
import { flags } from '@oclif/command';
import { ConfiguredCommand } from '../../configured-command';
import chalk from 'chalk';
import { updateApp } from '../../api';
import { format } from '../../flags/format-flag';
import { app } from '../../flags/app-flag';
import { APP_COLUMNS } from './index';

export default class AppsUpdate extends ConfiguredCommand {
  static description = 'update an app';

  static examples = [
    'amp apps:update --name="my new name"',
    'amp apps:update -a ckm1w4vy857869go3nsw4mk2ay --name "my new name"',
    'amp apps:update --name "my new name" --description "my new description"',
  ];

  static flags = {
    ...cli.table.flags(),
    format: format(),
    app: app(),

    name: flags.string({
      required: false,
      description: 'name of the app',
    }),
    description: flags.string({
      required: false,
      description: 'description of the app',
    }),
  };

  async command() {
    const { flags } = this.parse(AppsUpdate);

    const appId = flags.app;
    if (!appId) {
      this.error(`Missing required flag: -a, --app`);
    } else {
      const name = flags.name;
      const description = flags.description;

      cli.action.start(`Updating app ${chalk.green.bold(appId)} `);

      const data = await updateApp(this.client, appId, {
        name,
        description,
      });

      cli.action.stop();
      this.output(data, flags, APP_COLUMNS);
    }
  }
}
