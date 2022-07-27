export interface StorageService {
  saveFile(bucket: string, filePath: string, data: Uint8Array): Promise<void>;
}
