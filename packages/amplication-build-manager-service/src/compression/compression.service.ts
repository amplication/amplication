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
}
