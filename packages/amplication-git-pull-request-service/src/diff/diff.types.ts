import { File } from "@amplication/git-utils";
import { Difference } from "dir-compare";

export type DiffVisitorFn = (diff: Difference) => File | null;
