import cli from 'cli-ux';
import { ConfiguredCommand } from '../../configured-command';
import { getApp } from '../../api';
import { flags } from '@oclif/command';
import { format } from '../../flags/format-flag';
import { AMP_CURRENT_APP } from '../../properties';
import { APP_COLUMNS } from './index';

export default class AppsCurrent extends ConfiguredCommand {
  static flags = {
    ...cli.table.flags(),
    format: format(),

    app: flags.string({
      char: 'a',
      required: true,
      description: 'ID of the app',
    }),
  };

  async command() {
    const { flags } = this.parse(AppsCurrent);

    const appId = flags.app;
    this.setConfig(AMP_CURRENT_APP, appId);

    const data = await getApp(this.client, appId);
    this.log(`Updated property ${AMP_CURRENT_APP}`);

    this.output(data, flags, APP_COLUMNS);
  }
}
