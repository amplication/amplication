import AdmZip from 'adm-zip';
import * as DataServiceGenerator from '@amplication/data-service-generator';

export async function createZipFileFromModules(
  modules: DataServiceGenerator.Module[]
): Promise<Buffer> {
  const zip = new AdmZip();
  await Promise.all(
    modules.map(module =>
      zip.addFile(module.path, Buffer.from(module.code, 'utf8'))
    )
  );
  return zip.toBuffer();
}
