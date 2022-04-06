import { Injectable } from "@nestjs/common";
import { GitPullEventRepository } from "../../databases/gitPullEvent.repository";

@Injectable()
export class GitPullEventService {
  constructor(private gitPullEventRepository: GitPullEventRepository) {}
}
