import tar from 'tar-stream';
import { Buffer } from 'buffer';
import * as DataServiceGenerator from 'amplication-data-service-generator';

export function createTarFileFromModules(
  modules: DataServiceGenerator.Module[]
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const pack = tar.pack();
    for (const module of modules) {
      const entry = pack.entry({ name: module.path }, module.code);
      entry.end();
    }
    const chunks = [];
    pack.on('data', chunk => {
      chunks.push(chunk);
    });
    pack.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    pack.on('error', error => {
      reject(error);
    });
    pack.finalize();
  });
}
