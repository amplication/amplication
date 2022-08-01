export interface CodeGenNotificationMessage {
  account: string;
  detailType: string;
  region: string;
  source: string;
  time: string;
  notificationRuleArn: string;
  detail: BuildPhaseChangeDetail | BuildStateChangeDetail;
  resources: string[];
  additionalAttributes: Record<string, unknown>;
}

export interface Phase {
  phaseContext: string[];
  startTime: string;
  endTime: string;
  durationInSeconds: number;
  phaseType: string;
  phaseStatus: string;
}

export interface Artifact {
  md5sum: string;
  sha256sum: string;
  location: string;
}

export interface AdditionalInformation {
  cache: Cache;
  buildNumber: number;
  timeoutInMinutes: number;
  buildComplete: boolean;
  initiator: string;
  buildStartTime: string;
  source: Source;
  artifact: Artifact;
  environment: Environment;
  logs: Logs;
  phases: Phase[];
  queuedTimeoutInMinutes: number;
}

export interface BuildPhaseChangeDetail {
  'build-id': string;
  'project-name': string;
  'completed-phase': string;
  'completed-phase-context': string;
  'additional-information': AdditionalInformation;
  'completed-phase-status': string;
  'completed-phase-duration-seconds': number;
  'completed-phase-start': string;
  'completed-phase-end': string;
  version: string;
}

export interface BuildStateChangeDetail {
  'build-status': string;
  'project-name': string;
  'build-id': string;
  'additional-information': AdditionalInformation;
  'current-phase': string;
  'current-phase-context': string;
  version: string;
}

export interface Source {
  location: string;
  type: string;
}

export interface Environment {
  image: string;
  privilegedMode: boolean;
  imagePullCredentialsType: string;
  computeType: string;
  type: string;
  environmentVariables: any[];
}

export interface Logs {
  groupName: string;
  streamName: string;
  deepLink: string;
}

export interface CodeGenNotification {
  Type: string;
  MessageId: string;
  TopicArn: string;
  Message: string;
  Timestamp: Date;
  SignatureVersion: string;
  Signature: string;
  SigningCertURL: string;
  UnsubscribeURL: string;
}
