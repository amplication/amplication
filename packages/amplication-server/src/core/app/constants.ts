import { AppSettings } from './dto';

export const DEFAULT_APP_SETTINGS: Omit<AppSettings, 'id'> = {
  dbHost: 'localhost',
  dbName: '',
  dbUser: 'admin',
  dbPassword: 'admin',
  dbPort: 5432
};
