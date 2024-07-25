import { Template } from "../template/Template";

export type Model = {
  createdAt: Date;
  id: string;
  name: string;
  updatedAt: Date;
  templates?: Array<Template>;
};
