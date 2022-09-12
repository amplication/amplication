import {GitProvider} from "./git-provider.interface";

export interface GitFactory {
    getClient(
        installationId: string,
        owner: string,
        repo: string
    ): Promise<GitProvider>
}