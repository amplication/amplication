import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { PaginateQuery } from "nestjs-paginate";
import { DefaultAuthGuard } from "src/auth/defaultAuth.guard";
import { FileMeta } from "./dto/FileMeta";
import { StorageService } from "./storage.service";

const APP_ID_PARAM_KEY = "appId";
const BUILD_ID_PARAM_KEY = "buildId";

@UseGuards(DefaultAuthGuard)
@Controller("storage")
export class StorageController {
  constructor(protected readonly service: StorageService) {}
  @Get(`/:${APP_ID_PARAM_KEY}/:${BUILD_ID_PARAM_KEY}/list`)
  getBuildFilesList(
    @Param(APP_ID_PARAM_KEY) appId: string,
    @Param(BUILD_ID_PARAM_KEY) buildId: string,
    @Query() query: PaginateQuery
  ): FileMeta[] {
    return this.service.getBuildFilesList(appId, buildId, query.path);
  }
  @Get(`/:${APP_ID_PARAM_KEY}/:${BUILD_ID_PARAM_KEY}/content`)
  fileContent(
    @Param(APP_ID_PARAM_KEY) appId: string,
    @Param(BUILD_ID_PARAM_KEY) buildId: string,
    @Query("path") path: string
  ): string {
    return this.service.fileContent(appId, buildId, path);
  }
}
