import { Difference } from "dir-compare";
import { PrModule } from "../types";

export type DiffVisitorFn = (diff: Difference) => PrModule | null;
