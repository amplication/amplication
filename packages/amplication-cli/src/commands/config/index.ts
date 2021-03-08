import { ConfiguredCommand } from '../../configured-command';
import { allowedProperties } from '../../properties';

export default class ConfigIndex extends ConfiguredCommand {
  async command() {
    for (const prop of allowedProperties)
      this.log(`${prop}=${this.getConfig(prop)}`);
  }
}
