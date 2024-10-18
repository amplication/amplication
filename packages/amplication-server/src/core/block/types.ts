import { Block } from "../../models";

export type BlockValues<T> = Omit<
  T,
  "blockType" | "description" | "displayName"
> & { resourceId: string };

export type BlockValuesExtended<T> = Omit<
  T,
  | "createdAt"
  | "updatedAt"
  | "parentBlock"
  | "versionNumber"
  | "inputParameters"
  | "outputParameters"
  | "lockedByUserId"
  | "lockedAt"
  | "resourceId"
>;

export type BlockSettingsProperties<T> = Omit<
  T,
  keyof Block | "inputParameters" | "outputParameters"
>;
