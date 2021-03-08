import cli from 'cli-ux';
import { ConfiguredCommand } from '../../configured-command';
import { getEntities } from '../../api';
import { app } from '../../flags';

export default class EntitiesIndex extends ConfiguredCommand {
  static flags = {
    app: app(),
  };

  async command() {
    const { flags } = this.parse(EntitiesIndex);

    const appIdFlag = flags.app;
    let appId = '';

    if (!appIdFlag) {
      appId = await cli.prompt('app', { required: true });
    }

    const data = await getEntities(
      this.client,
      appIdFlag || appId,
      undefined,
      undefined
    );
    cli.styledJSON(data);
  }
}
