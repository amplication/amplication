import { Injectable } from "@nestjs/common";
// @ts-ignore: Cannot find module
import { PrismaService } from "../prisma/prisma.service";
// @ts-ignore: String literal expected.
import { ENTITY } from "ENTITY_DTO_MODULE";
// @ts-ignore: All imports in import declaration are unused.
import { FIND_ONE_ARGS, FIND_MANY_ARGS } from "@prisma/client";

@Injectable()
export class SERVICE {
  constructor(private readonly prisma: PrismaService) {}
}
