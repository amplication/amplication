import { createUnionType } from '@nestjs/graphql';
import { User } from 'src/models'; // eslint-disable-line import/no-cycle
import { Invitation } from './Invitation'; // eslint-disable-line import/no-cycle

// eslint-disable-next-line  @typescript-eslint/naming-convention
export const WorkspaceMemberType = createUnionType({
  name: 'WorkspaceMemberType',
  types: () => [User, Invitation],
  resolveType(value) {
    if (value.hasOwnProperty('email')) {
      return Invitation;
    }
    return User;
  }
});
