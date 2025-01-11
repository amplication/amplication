import { Version } from "./version.interface";

interface Generator {
  name: string;
  fullName: string;
  isActive: boolean;
  version: Version[];
}

export { Generator };
