import { AmplicationError } from 'src/errors/AmplicationError';

export const MISSING_TOKEN_ERROR = new AmplicationError(
  '`App Missing a Github token. You should first complete the authorization process`'
);
