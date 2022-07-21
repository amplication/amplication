import {App} from "./app";
const core = require('@actions/core');

try {
    const WORKING_DIRECTORY = process.env.GITHUB_WORKSPACE || `${process.cwd()}/../../../..`;
    const FILES:string[] = core.getInput('files-to-find') || [`Dockerfile`];
    const INCLUDE_FOLDERS:string[] = core.getInput('include-folders') || [`ee/packages`,`packages`];
    const IGNORE_FOLDERS:string[] = core.getInput('ignore-folders') || ["node_modules", "lib", "dist", "bin", "src","__mocks__","public","scripts","test","prisma" ,"graphql","generated" ];
    const RECURSIVE:boolean = core.getInput('search-recursive') || true;

    const result = new App(WORKING_DIRECTORY,FILES,IGNORE_FOLDERS).findFoldersContainingDockerfile(INCLUDE_FOLDERS,RECURSIVE)

    console.dir(result)

    core.setOutput("folders", result);
} catch (error){
    core.setFailed(error);
}

