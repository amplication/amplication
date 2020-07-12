import { Controller, Get, Post, Param, Query, Body } from "@nestjs/common";
import { $$ENTITY$$ } from "$$ENTITY_DTO_MODULE$$";
import { $$ENTITY$$Service } from "$$ENTITY_SERVICE_MODULE$$";
import { NotFoundException } from "@nestjs/common";

@Controller("customers")
export class $$ENTITY$$Controller {
  constructor(private readonly service: $$ENTITY$$Service) {}

  $$METHODS$$;
}
