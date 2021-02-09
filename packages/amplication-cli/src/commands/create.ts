import cli from 'cli-ux';
import { ConfiguredCommand } from '../configured-command';
import { gql } from 'apollo-boost';

const CREATE_APP = gql`
  mutation createApp($data: AppCreateInput!) {
    createApp(data: $data) {
      id
      name
      description
    }
  }
`;

export default class Login extends ConfiguredCommand {
  async command() {
    const token = this.getConfig('token');
    if (!token) {
      this.error('Unauthorized');
      this.exit(1);
    }
    const name = await cli.prompt('name', { required: true });
    const description = await cli.prompt('description', { required: true });

    if (name && description) {
      try {
        await this.client.mutate({
          context: {
            headers: {
              authorization: `Bearer ${this.getConfig('token')}`,
            },
          },
          mutation: CREATE_APP,
          variables: {
            data: {
              name,
              description,
            },
          },
        });
      } catch (error) {
        this.error('Could not authorize user');
      }
    }
  }
}
