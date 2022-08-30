import { Module } from '@amplication/code-gen-types';
import AdmZip from 'adm-zip';

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
