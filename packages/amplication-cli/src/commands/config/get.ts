import { ConfiguredCommand } from '../../configured-command';
import { allowedProperties } from '../../properties';

export default class ConfigGet extends ConfiguredCommand {
  static args = [
    {
      name: 'property',
      required: true,
      description: 'name of property',
    },
  ];

  async command() {
    const { args } = this.parse(ConfigGet);

    const propertyName = args.property;

    if (!allowedProperties.includes(propertyName)) {
      this.error(`Unknown property '${propertyName}'`);
    }
    this.log(this.getConfig(propertyName));
  }
}
