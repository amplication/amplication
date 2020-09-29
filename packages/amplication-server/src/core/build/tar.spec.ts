import { createTarFileFromModules } from './tar';

describe('createTarFileFromModules', () => {
  test('it creates a tar file', async () => {
    const modules = [
      {
        path: 'EXAMPLE_PATH',
        code: 'EXAMPLE_CODE'
      }
    ];
    await expect(createTarFileFromModules(modules)).resolves.toMatchSnapshot();
  });
});
