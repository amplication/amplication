import cli from 'cli-ux';
import { ConfiguredCommand } from '../../configured-command';
import { getApp } from '../../api';
import { app } from '../../flags/app-flag';
import { format } from '../../flags/format-flag';
import { APP_COLUMNS } from './index';

export default class AppInfo extends ConfiguredCommand {
  static description = 'show detailed information for an app';

  static examples = [
    'amp apps:info',
    'amp apps:info -a ckm1w4vy857869go3nsw4mk2ay',
  ];

  static flags = {
    ...cli.table.flags(),
    app: app(),
    format: format(),
  };

  async command() {
    const { flags } = this.parse(AppInfo);

    const appIdFlag = flags.app;
    let appId = '';

    if (!appIdFlag) {
      appId = await cli.prompt('app', { required: true });
    }

    const data = await getApp(this.client, appIdFlag || appId);
    this.output(data, flags, APP_COLUMNS);
  }
}
