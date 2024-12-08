import { prepareFilesForPullRequest } from "./prepare-files-for-pull-request";
import { File, GitResourceMeta, UpdateFile } from "../types";
import { AmplicationIgnoreManger } from "../utils/amplication-ignore-manger";

describe("prepareFilesForPullRequest", () => {
  const gitResourceMeta: GitResourceMeta = {
    serverPath: "server",
    adminUIPath: "admin",
  };

  const amplicationIgnoreManger = {
    isIgnored: jest.fn(),
  } as unknown as AmplicationIgnoreManger;

  it("should not override server/scripts/customSeed.ts", async () => {
    const pullRequestModule: File[] = [
      { path: "server/scripts/customSeed.ts", content: "content" },
    ];

    const result = await prepareFilesForPullRequest(
      gitResourceMeta,
      pullRequestModule,
      amplicationIgnoreManger,
      false
    );

    expect(result).toEqual([
      {
        path: "server/scripts/customSeed.ts",
        content: "content",
        skipIfExists: true,
        deleted: false,
      },
    ]);
  });

  it("should not override customizable files when overrideCustomizableFilesInGit is false", async () => {
    const pullRequestModule: File[] = [
      { path: "server/src/entity/entity.controller.ts", content: "content" },
    ];

    const result = await prepareFilesForPullRequest(
      gitResourceMeta,
      pullRequestModule,
      amplicationIgnoreManger,
      false
    );

    expect(result).toEqual([
      {
        path: "server/src/entity/entity.controller.ts",
        content: "content",
        skipIfExists: true,
        deleted: false,
      },
    ]);
  });

  it("should override customizable files when overrideCustomizableFilesInGit is true", async () => {
    const pullRequestModule: File[] = [
      { path: "server/src/entity/entity.controller.ts", content: "content" },
    ];

    const result = await prepareFilesForPullRequest(
      gitResourceMeta,
      pullRequestModule,
      amplicationIgnoreManger,
      true
    );

    expect(result).toEqual([
      {
        path: "server/src/entity/entity.controller.ts",
        content: "content",
        skipIfExists: false,
        deleted: false,
      },
    ]);
  });

  it("should handle ignored files", async () => {
    (amplicationIgnoreManger.isIgnored as jest.Mock).mockReturnValueOnce(true);
    const pullRequestModule: File[] = [
      { path: "ignored/file.ts", content: "content" },
    ];

    const result = await prepareFilesForPullRequest(
      gitResourceMeta,
      pullRequestModule,
      amplicationIgnoreManger,
      false
    );

    expect(result).toEqual([
      {
        path: ".amplication/ignored/ignored/file.ts",
        content: "content",
        skipIfExists: false,
        deleted: false,
      },
    ]);
  });

  it("should handle deleted files", async () => {
    const pullRequestModule: File[] = [
      { path: "deleted/file.ts", content: null },
    ];

    const result = await prepareFilesForPullRequest(
      gitResourceMeta,
      pullRequestModule,
      amplicationIgnoreManger,
      false
    );

    expect(result).toEqual([
      {
        path: "deleted/file.ts",
        content: null,
        skipIfExists: false,
        deleted: true,
      },
    ]);
  });

  it("should handle regular files", async () => {
    const pullRequestModule: File[] = [
      { path: "server/src/regular/file.ts", content: "content" },
    ];

    const result = await prepareFilesForPullRequest(
      gitResourceMeta,
      pullRequestModule,
      amplicationIgnoreManger,
      false
    );

    expect(result).toEqual([
      {
        path: "server/src/regular/file.ts",
        content: "content",
        skipIfExists: false,
        deleted: false,
      },
    ]);
  });
});
