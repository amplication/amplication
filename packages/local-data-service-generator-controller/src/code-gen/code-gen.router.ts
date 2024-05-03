import { Router } from "express";
import { generateCode } from "./code-gen.controller";

const codeGenRouter = Router();

codeGenRouter.post("/", generateCode);

export default codeGenRouter;
