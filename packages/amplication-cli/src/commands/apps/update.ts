import cli from 'cli-ux';
import { flags } from '@oclif/command';
import { ConfiguredCommand } from '../../configured-command';
import chalk from 'chalk';
import { updateApp } from '../../api';
import { app } from '../../flags';

export default class AppsUpdate extends ConfiguredCommand {
  static flags = {
    app: app(),
    name: flags.string({
      required: false,
      description: 'name of the app',
    }),
    description: flags.string({
      required: true,
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
      cli.styledJSON(data);
    }
  }
}
