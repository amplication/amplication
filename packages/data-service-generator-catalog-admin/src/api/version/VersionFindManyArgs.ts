import { VersionWhereInput } from "./VersionWhereInput";
import { VersionOrderByInput } from "./VersionOrderByInput";

export type VersionFindManyArgs = {
  where?: VersionWhereInput;
  orderBy?: Array<VersionOrderByInput>;
  skip?: number;
  take?: number;
};
