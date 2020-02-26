import { registerEnumType } from 'type-graphql';

export enum OrderDirection {
  // Specifies an ascending order for a given `orderBy` argument.
  asc = 'asc',
  // Specifies a descending order for a given `orderBy` argument.
  desc = 'desc'
}

registerEnumType(OrderDirection, {
  name: 'OrderDirection',
  description:
    'Possible directions in which to order a list of items when provided an `orderBy` argument.'
});
