import { ConfiguredCommand } from '../../configured-command';
import { allowedProperties } from '../../properties';

export default class ConfigUnset extends ConfiguredCommand {
  static description = 'unset a property value';

  static examples = ['amp config:unset AMP_CURRENT_RESOURCE'];

  static args = [
    {
      name: 'property',
      required: true,
      description: 'name of property',
    },
  ];

  async command() {
    const { args } = this.parse(ConfigUnset);

    const propertyName = args.property;

    if (!allowedProperties.includes(propertyName)) {
      this.error(`Unknown property '${propertyName}'`);
    }
    this.setConfig(propertyName, undefined);

    this.log(`Unset property '${propertyName}'`);
  }
}
