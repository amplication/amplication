import { ConfiguredCommand } from '../../configured-command';
import { allowedProperties } from '../../properties';

export default class ConfigSet extends ConfiguredCommand {
  static description = 'set a property value';

  static examples = [
    'amp config:set AMP_CURRENT_RESOURCE ckm1w4vy857869go3nsw4mk2ay',
    'amp config:set AMP_SERVER_URL https://app.amplication.com',
    'amp config:set AMP_OUTPUT_FORMAT styledJSON',
  ];

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
