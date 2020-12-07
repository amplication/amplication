import zlib from 'zlib';
import tar from 'tar-stream';
import getStream from 'get-stream';
import * as DataServiceGenerator from '@amplication/data-service-generator';

export function createTarGzFileFromModules(
  modules: DataServiceGenerator.Module[]
): Promise<Buffer> {
  const pack = tar.pack();
  for (const module of modules) {
    const entry = pack.entry({ name: module.path }, module.code);
    entry.end();
  }
  pack.finalize();
  return getStream.buffer(pack.pipe(zlib.createGzip()));
}
