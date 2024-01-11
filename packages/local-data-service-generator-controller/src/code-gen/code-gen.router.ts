import { generateCode } from "./code-gen.controller";
import { Router } from "express";

const codeGenRouter = Router();

codeGenRouter.post("/", generateCode);

export default codeGenRouter;
