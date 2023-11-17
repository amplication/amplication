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

const RESOURCE_ID_PARAM_KEY = "resourceId";
const BUILD_ID_PARAM_KEY = "buildId";
const PATH_PARAM_KEY = "path";

@UseGuards(DefaultAuthGuard, CodeAccessGuard)
@Controller("storage")
export class StorageController {
  constructor(
    protected readonly service: StorageService,
    protected readonly paginationService: PaginationService
  ) {}

  @Get(`/:${RESOURCE_ID_PARAM_KEY}/:${BUILD_ID_PARAM_KEY}/list`)
  getBuildFilesList(
    @Param(RESOURCE_ID_PARAM_KEY) resourceId: string,
    @Param(BUILD_ID_PARAM_KEY) buildId: string,
    @Query(PATH_PARAM_KEY) path: string | undefined,
    @Query() query: PaginationQuery
  ): PaginationResult<FileMeta> {
    const results = this.service.getBuildFilesList(resourceId, buildId, path);
    return this.paginationService.paginate(results, query);
  }
  @Get(`/:${RESOURCE_ID_PARAM_KEY}/:${BUILD_ID_PARAM_KEY}/content`)
  @Header("Content-Type", "text/plain")
  fileContent(
    @Param(RESOURCE_ID_PARAM_KEY) resourceId: string,
    @Param(BUILD_ID_PARAM_KEY) buildId: string,
    @Query("path") path: string | undefined
  ): string {
    return this.service.fileContent(resourceId, buildId, path);
  }
}
