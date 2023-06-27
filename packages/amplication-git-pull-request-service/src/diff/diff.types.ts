import { File } from "@amplication/util/git";
import { Difference } from "dir-compare";

export type DiffVisitorFn = (diff: Difference) => File | null;
