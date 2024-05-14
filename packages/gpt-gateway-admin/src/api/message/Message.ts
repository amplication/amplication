import { Template } from "../template/Template";

export type Message = {
  content: string;
  createdAt: Date;
  id: string;
  position: number | null;
  role?: "User" | "System" | "Assistant";
  template?: Template | null;
  updatedAt: Date;
};
