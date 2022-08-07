import JSZip from 'jszip';

export interface File {
  path: string;
  data: Buffer;
}

export class CompressionService {
  async createZipArchive(files: File[]): Promise<Uint8Array> {
    const zip = new JSZip();
    files.forEach((file) => {
      zip.file(file.path, file.data);
    });
    return await zip.generateAsync({ type: 'uint8array' });
  }

  async unpackZipArchive(archive: Buffer): Promise<File[]> {
    const zip = await JSZip.loadAsync(archive);
    const files: File[] = [];
    const promises = Object.entries(zip.files).map(async ([path, file]) => {
      const encData = await file.async('uint8array');
      const data = Buffer.from(encData);
      files.push({ path, data });
    });
    await Promise.all(promises);
    return files;
  }
}
