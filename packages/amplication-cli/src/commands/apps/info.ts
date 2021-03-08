import cli from 'cli-ux';
import { ConfiguredCommand } from '../../configured-command';
import { getApp } from '../../api';
import { app } from '../../flags/app-flag';
import { format } from '../../flags/format-flag';

export default class AppInfo extends ConfiguredCommand {
  static flags = {
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
    this.output(data, flags, { id: {}, name: {}, description: {} });
  }
}
