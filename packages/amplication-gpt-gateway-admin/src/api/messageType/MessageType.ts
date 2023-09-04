import { Template } from "../template/Template";

export type MessageType = {
  createdAt: Date;
  id: string;
  key: string;
  template?: Template | null;
  updatedAt: Date;
};
