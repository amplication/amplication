import cli from 'cli-ux';
import { ConfiguredCommand } from '../configured-command';
import { gql } from 'apollo-boost';

const DO_LOGIN = gql`
  mutation login($data: LoginInput!) {
    login(data: $data) {
      token
    }
  }
`;

export default class Login extends ConfiguredCommand {
  async command() {
    const email = await cli.prompt('email', {
      required: true,
    });
    const password = await cli.prompt('password', {
      required: true,
      type: 'hide',
    });

    this.log(this.getConfig('token'));

    if (email && password) {
      try {
        const tokenData = await this.client.mutate({
          mutation: DO_LOGIN,
          variables: {
            data: {
              email,
              password,
            },
          },
        });
        if (tokenData.data.login.token)
          this.setConfig('token', tokenData.data.login.token);
      } catch (error) {
        this.error('Could not authorize user');
      }
    }
  }
}
