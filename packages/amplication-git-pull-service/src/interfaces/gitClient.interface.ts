export interface IGitClient {
 clone: (cloneParams: ICloneParams) => void;
 pull: (pullParams: IPullParams) => void;
}

export interface ICloneParams {
 owner: string;
 repository: string;
 installationId: string;
}

export interface IPullParams {
 branch: string;
 remote: string;
}
