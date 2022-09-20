import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class CommitTopicsConfigDto {
  public static readonly TOPIC_COMMIT_INITIATED = "TOPIC_COMMIT_INITIATED"
  public static readonly TOPIC_COMMIT_STATE = "TOPIC_COMMIT_STATE"

  public commitInitiatedTopic: string
  public commitCommitState: string

  constructor(configService: ConfigService) {
    const commitInitiatedTopic = configService.get<string>(CommitTopicsConfigDto.TOPIC_COMMIT_INITIATED)
    if (commitInitiatedTopic) {
      this.commitInitiatedTopic = commitInitiatedTopic
    } else {
      throw new Error(`Missing environment variable ${CommitTopicsConfigDto.TOPIC_COMMIT_INITIATED}`)
    }

    const commitCommitState = configService.get<string>(CommitTopicsConfigDto.TOPIC_COMMIT_STATE)
    if (commitCommitState) {
      this.commitCommitState = commitCommitState
    } else {
      throw new Error(`Missing environment variable ${CommitTopicsConfigDto.TOPIC_COMMIT_STATE}`)
    }
  }
}