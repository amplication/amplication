import cli from 'cli-ux';
import { flags } from '@oclif/command';
import { ConfiguredCommand } from '../../configured-command';
import chalk from 'chalk';
import { createApp } from '../../api';
import { format } from '../../flags/format-flag';
import { APP_COLUMNS } from './index';
import { AMP_CURRENT_APP } from '../../properties';

export default class AppsCreate extends ConfiguredCommand {
  static description = 'create a new app';

  static examples = [
    'amp apps:create "my cool app" "my app description" --set-current',
  ];

  static flags = {
    ...cli.table.flags(),
    format: format(),
    ['set-current']: flags.boolean({
      default: false,
      description: 'set the newly created app as the current app',
    }),
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

    if (flags['set-current'] === true) {
      this.setConfig(AMP_CURRENT_APP, data.id);
      this.log(`Property updated - ${AMP_CURRENT_APP}=${data.id}`);
    }

    cli.action.stop();
    this.output(data, flags, APP_COLUMNS);
  }
}
