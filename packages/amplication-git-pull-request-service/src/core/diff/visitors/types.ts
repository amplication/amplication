import { Difference } from 'dir-compare';
import { PrModule } from '../../../constants';

export type DiffVisitorFn = (diff: Difference) => PrModule | null;
