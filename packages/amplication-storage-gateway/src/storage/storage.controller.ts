import {
  Controller,
  Get,
  Header,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CodeAccessGuard } from "../auth/codeAccessGuard.guard";
import { DefaultAuthGuard } from "../auth/defaultAuth.guard";
import { PaginationQuery, PaginationResult } from "../pagination";
import { PaginationService } from "../pagination/pagination.service";
import { FileMeta } from "./dto/FileMeta";
import { StorageService } from "./storage.service";

const APP_ID_PARAM_KEY = "appId";
const BUILD_ID_PARAM_KEY = "buildId";
const PATH_PARAM_KEY = "path";

@UseGuards(DefaultAuthGuard, CodeAccessGuard)
@Controller("storage")
export class StorageController {
  constructor(
    protected readonly service: StorageService,
    protected readonly paginationService: PaginationService
  ) {}

  @Get()
  testStorage(): string {
    return "hello world";
  }

  @Get(`/:${APP_ID_PARAM_KEY}/:${BUILD_ID_PARAM_KEY}/list`)
  getBuildFilesList(
    @Param(APP_ID_PARAM_KEY) appId: string,
    @Param(BUILD_ID_PARAM_KEY) buildId: string,
    @Query(PATH_PARAM_KEY) path: string | undefined,
    @Query() query: PaginationQuery
  ): PaginationResult<FileMeta> {
    const results = this.service.getBuildFilesList(appId, buildId, path);
    return this.paginationService.paginate(results, query);
  }
  @Get(`/:${APP_ID_PARAM_KEY}/:${BUILD_ID_PARAM_KEY}/content`)
  @Header("Content-Type", "text/plain")
  fileContent(
    @Param(APP_ID_PARAM_KEY) appId: string,
    @Param(BUILD_ID_PARAM_KEY) buildId: string,
    @Query("path") path: string | undefined
  ): string {
    return this.service.fileContent(appId, buildId, path);
  }
}
