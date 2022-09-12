import {mock} from 'jest-mock-extended';
import { ConfigService } from '@nestjs/config';
import { GithubFactory, GitProvider } from "@amplication/git-service";
import {CommitsService} from "../core/commit/commits.service";
import {AmplicationLogger} from "@amplication/nest-logger-module";

//TODO: Add environments to GitHub workflow tests
const APP_ID = 230968;
const APP_PEM = "";
const INSTALLATION_ID = 28672211;
const OWNER = 'matan-test-org';
const REPO = 'integration-test';

let githubFactory: GithubFactory;
let client: GitProvider;
let commitService: CommitsService

beforeAll(async () => {
    const configService = mock<ConfigService>();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    configService.get.calledWith("GITHUB_APP_APP_ID").mockReturnValue(APP_ID);
    configService.get
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .calledWith("GITHUB_APP_PRIVATE_KEY")
        .mockReturnValue(APP_PEM);

    githubFactory = new GithubFactory(configService);
    client = await githubFactory.getClient(
        INSTALLATION_ID.toString(),
        OWNER,
        REPO,
    );
    await client.deleteRepository();

});

beforeEach(async ()=>{
    client = await githubFactory.getClient(
        INSTALLATION_ID.toString(),
        OWNER,
        REPO,
    );
    await client.createRepository(false)
    const amplicationLogger = mock<AmplicationLogger>()
    amplicationLogger.info.calledWith((...str)=>{
        console.log(str)
    })
    amplicationLogger.debug.calledWith((...str)=>{
        console.log(str)
    })

    commitService = new CommitsService(githubFactory,amplicationLogger)
})

afterEach(async ()=>{
    client = await githubFactory.getClient(
        INSTALLATION_ID.toString(),
        OWNER,
        REPO,
    );
    await client.createRepository(false)
})


afterAll(async () => {
    client = await githubFactory.getClient(
        INSTALLATION_ID.toString(),
        OWNER,
        REPO,
    );
    await client.deleteRepository();

});


describe.skip("add commit repository",()=>{

    test("first commit create pull request and branch",async ()=>{
        const input_build =  "build-id"
        const input_commit =  "commit-id"

        const {
            buildId,
            commit,
            pullRequest,
            pullRequestComment
        } = await commitService.addCommitToRepository(INSTALLATION_ID.toString(),{
            buildId: input_build,
            resourceId: "resource-id",
            resourceName:"",
            commitId: input_commit,
            owner: OWNER,
            repo:REPO
        },"test-1",[{
            path:"src/test",
            content: "test"
        }])

        expect(buildId).toEqual(input_build)
        expect(commit).toBeTruthy()
        expect(commit.sha).toBeTruthy()
        expect(Date.parse(commit.timestamp)).toBeLessThanOrEqual(new Date().getTime())
        expect(pullRequest).toBeTruthy()
        expect(pullRequest.number).toBeGreaterThan(0)
        expect(pullRequest.created).toEqual(true)
        expect(pullRequest.url).toBeTruthy()
        expect(pullRequestComment).toBeTruthy()
        expect(pullRequestComment.url).toBeTruthy()
    })

    test("second commit add commit to branch and add new comment",async ()=>{
        const input_build =  "build-id"
        const input_commit =  "commit-id"

        const firstCommit = await commitService.addCommitToRepository(INSTALLATION_ID.toString(),{
            buildId: input_build,
            resourceId: "resource-id",
            resourceName:"",
            commitId: input_commit,
            owner: OWNER,
            repo:REPO
        },"test-1",[{
            path:"src/test",
            content: "test"
        }])

        const secondCommit = await commitService.addCommitToRepository(INSTALLATION_ID.toString(),{
            buildId: input_build,
            resourceId: "resource-id",
            resourceName:"",
            commitId: input_commit,
            owner: OWNER,
            repo:REPO
        },"test-1",[{
            path:"src/test",
            content: "test2"
        }])

        expect(secondCommit.pullRequest.created).toEqual(false)
        expect(secondCommit.pullRequestComment.url).toBeTruthy()
        expect(secondCommit.pullRequestComment.url).not.toEqual(firstCommit.pullRequestComment.url)
    })

})