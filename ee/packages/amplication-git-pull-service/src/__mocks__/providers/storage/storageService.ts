import { mock } from 'jest-mock-extended';
import { StorageService } from '../../../providers/storage/storage.service';

export const MOCK_STORAGE_SERVICE = mock<StorageService>({});

MOCK_STORAGE_SERVICE.copyDir.mockReturnValue(Promise.resolve());
