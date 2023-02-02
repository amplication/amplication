import { Request, Response } from "express";
import Docker from "dockerode";
import { CodeGenerationRequest } from "./types";

function generateCode(req: Request, res: Response) {
  const { resourceId, buildId } = req.body as CodeGenerationRequest;

  const imageName = "amplication/data-service-generator-runner";
  const containerName = `dsg-runner-${buildId}`;

  const {
    DSG_JOBS_BASE_FOLDER: dsgJogsBaseFolder,
    BUILD_VOLUME_PATH: dockerDsgFolder,
    BUILD_OUTPUT_PATH: buildOutputPath,
    BUILD_SPEC_PATH: buildSpecPath,
    BUILD_MANAGER_URL: buildMangerUrl,
    AUTOREMOVE_CONTAINER: autoRemove,
  } = process.env;

  const hostMachineDsgFolder = `${process.cwd()}/${dsgJogsBaseFolder}/${buildId}`;

  const docker = new Docker();

  docker
    .createContainer({
      Image: imageName,
      name: containerName,
      HostConfig: {
        Binds: [`${hostMachineDsgFolder}:${dockerDsgFolder}`],
        AutoRemove: Boolean(autoRemove),
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
