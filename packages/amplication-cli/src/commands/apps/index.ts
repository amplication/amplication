import cli from 'cli-ux';
import { ConfiguredCommand } from '../../configured-command';
import { getApps } from '../../api';

export default class AppsIndex extends ConfiguredCommand {
  async command() {
    const data = await getApps(this.client);

    cli.styledJSON(data);
  }
}
