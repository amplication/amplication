import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { $$ENTITY$$ } from "$$ENTITY_MODULE$$";

import {
  FindOne$$ENTITY$$Args,
  FindMany$$ENTITY$$Args,
  $$ENTITY$$CreateArgs,
} from "@prisma/client";

@Injectable()
export class $$ENTITY$$Service {
  constructor(private readonly prisma: PrismaService) {}

  $$METHODS$$;
}
