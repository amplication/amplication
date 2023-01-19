import { Request, Response } from "express";
import Docker from "dockerode";
import { CodeGenerationRequest } from "./types";

function generateCode(req: Request, res: Response) {
  const { resourceId, buildId } = req.body as CodeGenerationRequest;

  const imageName = "amplication/data-service-generator-runner";
  const containerName = `dsg-runner-${buildId}`;

  const hostMachineDsgFolder = `${process.cwd()}/${
    process.env.DSG_JOBS_BASE_FOLDER
  }/${buildId}`;
  const dockerDsgFolder = process.env.BUILD_VOLUME_PATH;
  const buildOutputPath = process.env.BUILD_OUTPUT_PATH;
  const buildSpecPath = process.env.BUILD_SPEC_PATH;
  const buildMangerUrl = process.env.BUILD_MANAGER_URL;

  const docker = new Docker();

  docker
    .createContainer({
      Image: imageName,
      name: containerName,
      HostConfig: {
        Binds: [`${hostMachineDsgFolder}:${dockerDsgFolder}`],
      },
      Cmd: ["node", "./src/main.js"],
      Env: [
        `BUILD_OUTPUT_PATH=${buildOutputPath}`,
        `BUILD_ID=${buildId}`,
        `RESOURCE_ID=${resourceId}`,
        `BUILD_SPEC_PATH=${buildSpecPath}`,
        `BUILD_MANAGER_URL=${buildMangerUrl}`,
        "REMOTE_ENV=true",
      ],
    })
    .then((container: Docker.Container) => container.start())
    .catch((err: Error) => console.log(err));

  res.send({
    message: `container: ${containerName}, buildId: ${buildId}, resourceId: ${resourceId}`,
  });
}

export { generateCode };
