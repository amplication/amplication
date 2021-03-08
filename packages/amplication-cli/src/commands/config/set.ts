import { ConfiguredCommand } from '../../configured-command';
import { allowedProperties } from '../../properties';

export default class ConfigSet extends ConfiguredCommand {
  static args = [
    {
      name: 'property',
      required: true,
      description: 'name of property',
    },
    {
      name: 'value',
      required: true,
      description: 'value of property',
    },
  ];

  async command() {
    const { args } = this.parse(ConfigSet);

    const propertyName = args.property;
    const propertyValue = args.value;

    if (!allowedProperties.includes(propertyName)) {
      this.error(`Unknown property '${propertyName}'`);
    }
    this.setConfig(propertyName, propertyValue);

    this.log(`Updated property '${propertyName}'`);
  }
}
