import { createContext } from "react";
import * as models from "../models";

export type PendingChangeItem = Pick<
  models.PendingChange,
  "resourceId" | "resourceType"
>;

export type ContextDataType = {
  pendingChanges: PendingChangeItem[];
  addEntity: (entityId: string) => void;
  addBlock: (blockId: string) => void;
  reset: () => void;
};

const PendingChangesContext = createContext<ContextDataType>({
  pendingChanges: [],
  addEntity: (entityId: string) => {},
  addBlock: (blockId: string) => {},
  reset: () => {},
});

export default PendingChangesContext;
