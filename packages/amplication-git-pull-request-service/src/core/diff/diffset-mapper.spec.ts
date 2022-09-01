import { DiffSet } from 'dir-compare';
import { mapDiffSetToPrModule } from './diffset-mapper';
import { DiffVisitorFn } from './visitors/types';

describe('Testing the diffset module mapper', () => {
  it('should return an empty array if no visitors are provided', () => {
    const diffSet: DiffSet = [];
    const visitors: DiffVisitorFn[] = [];
    const result = mapDiffSetToPrModule(diffSet, visitors);
    expect(result).toEqual([]);
  });
});
