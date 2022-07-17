export interface StorageService {
  saveFile(filePath: string, data: string): Promise<void>;
}
