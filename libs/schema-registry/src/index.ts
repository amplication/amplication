export * as CodeGenerationFailure from "./lib/code-generation-failure";
export * as CodeGenerationLog from "./lib/code-generation-log";
export * as CodeGenerationRequest from "./lib/code-generation-request";
export * as CodeGenerationSuccess from "./lib/code-generation-success";
export * as CreatePrFailure from "./lib/create-pr-failure";
export * as CreatePrRequest from "./lib/create-pr-request";
export * as CreatePrSuccess from "./lib/create-pr-success";
export * as CreatePrLog from "./lib/create-pr-log";
export * as CanUserAccessBuild from "./lib/can-user-access-build";
export * as DBSchemaImportRequest from "./lib/db-schema-import-request";
export * as UserActionLog from "./lib/user-action-log";
export * as UserAction from "./lib/user-action";
export * as GptConversationStart from "./lib/gpt-conversion-start";
export * as GptConversationComplete from "./lib/gpt-conversion-complete";
export * as UserBuild from "./lib/user-build";

export enum KAFKA_TOPICS {
  /// build-manager
  CREATE_PR_REQUEST_TOPIC = "git.internal.create-pr.request.2",
  CODE_GENERATION_REQUEST_TOPIC = "build.internal.code-generation.request.1",
  CODE_GENERATION_SUCCESS_TOPIC = "build.internal.code-generation.success.1",
  CODE_GENERATION_FAILURE_TOPIC = "build.internal.code-generation.failure.1",
  DSG_LOG_TOPIC = "build.internal.dsg-log.1",
  /// git-pull-request
  CREATE_PULL_REQUEST_COMPLETED_TOPIC = "git.internal.pull-request.completed.1",
  GENERATE_PULL_REQUEST_TOPIC = "git.internal.pull-request.request.1",
  CREATE_PR_LOG_TOPIC = "git.internal.create-pr.log.1",
  CREATE_PR_SUCCESS_TOPIC = "git.internal.create-pr.success.1",
  CREATE_PR_FAILURE_TOPIC = "git.internal.create-pr.failure.1",
  KAFKA_REPOSITORY_PUSH_QUEUE = "git.external.push.event.0",
  /// amplication-server
  CHECK_USER_ACCESS_TOPIC = "authorization.internal.can-access-build.request.0",
  DB_SCHEMA_IMPORT_TOPIC = "user-action.internal.db-schema-import.request.1",
  USER_ACTION_LOG_TOPIC = "user-action.internal.action-log.1",
  USER_ACTION_TOPIC = "user-action.internal.1",
  USER_BUILD_TOPIC = "user-build.internal.1",
  /// ai
  AI_CONVERSATION_START_TOPIC = "ai.internal.conversation.start.1",
  AI_CONVERSATION_COMPLETED_TOPIC = "ai.internal.conversation.completed.1",
}
