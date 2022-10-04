import AdmZip from 'adm-zip';
import { Module } from '@amplication/code-gen-types';

export async function createZipFileFromModules(
  modules: Module[]
): Promise<Buffer> {
  const zip = new AdmZip();
  await Promise.all(
    modules.map(module =>
      zip.addFile(module.path, Buffer.from(module.code, 'utf8'))
    )
  );
  return zip.toBuffer();
}
