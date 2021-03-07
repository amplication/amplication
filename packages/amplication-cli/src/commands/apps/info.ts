import cli from 'cli-ux';
import { ConfiguredCommand } from '../../configured-command';
import { getApp } from '../../api';
import { app } from '../../flags';

export default class AppInfo extends ConfiguredCommand {
  static flags = {
    app: app(),
  };

  async command() {
    const { flags } = this.parse(AppInfo);

    const appIdFlag = flags.app;
    let appId = '';

    if (!appIdFlag) {
      appId = await cli.prompt('app', { required: true });
    }

    const data = await getApp(this.client, appIdFlag || appId);
    cli.styledJSON(data);
  }
}
