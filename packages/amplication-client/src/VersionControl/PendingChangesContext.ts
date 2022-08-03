import { createContext } from "react";
import * as models from "../models";

export type PendingChangeItem = Pick<
  models.PendingChange,
  "originId" | "originType"
>;

export type ContextDataType = {
  pendingChanges: PendingChangeItem[];
  commitRunning: boolean /**@todo: change build process to be async in the server and remove this property */;
  isError: boolean;
  setIsError: (onError: boolean) => void;
  setCommitRunning: (isRunning: boolean) => void;
  addEntity: (entityId: string) => void;
  addBlock: (blockId: string) => void;
  addChange: (
    originId: string,
    originType: models.EnumPendingChangeOriginType
  ) => void;
  reset: () => void;
};

const PendingChangesContext = createContext<ContextDataType>({
  pendingChanges: [],
  commitRunning: false,
  isError: false,
  setIsError: (onError: boolean) => {
    throw new Error();
  },
  setCommitRunning: (isRunning: boolean) => {
    throw new Error();
  },
  addEntity: (entityId: string) => {
    throw new Error();
  },
  addBlock: (blockId: string) => {
    throw new Error();
  },
  addChange: (
    originId: string,
    originType: models.EnumPendingChangeOriginType
  ) => {
    throw new Error();
  },
  reset: () => {
    throw new Error();
  },
});

export default PendingChangesContext;
