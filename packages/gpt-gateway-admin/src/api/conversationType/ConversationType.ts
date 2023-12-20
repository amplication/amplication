import { Template } from "../template/Template";

export type ConversationType = {
  createdAt: Date;
  id: string;
  key: string;
  template?: Template | null;
  updatedAt: Date;
};
