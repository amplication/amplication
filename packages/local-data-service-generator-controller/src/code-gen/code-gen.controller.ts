import { Request, Response } from "express";
import Docker from "dockerode";
import { CodeGenerationRequest } from "./types";

function generateCode(req: Request, res: Response) {
  const { resourceId, buildId } = req.body as CodeGenerationRequest;

  console.log("generateCode", req.body);

  const imageName = "amplication/data-service-generator";
  const containerName = `dsg-controller-${buildId}`;

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
      AttachStderr: true,
      AttachStdout: true,
      HostConfig: {
        Binds: [`${hostMachineDsgFolder}:${dockerDsgFolder}`],
        AutoRemove: Boolean(autoRemove === "true"),
      },
      Cmd: ["node", "./src/main.js"],
      Env: [
        "NODE_ENV=Development",
        `BUILD_OUTPUT_PATH=${buildOutputPath}`,
        `BUILD_ID=${buildId}`,
        `RESOURCE_ID=${resourceId}`,
        `BUILD_SPEC_PATH=${buildSpecPath}`,
        `BUILD_MANAGER_URL=${buildMangerUrl}`,
        "REMOTE_ENV=true",
      ],
    })
    .then((container: Docker.Container) => {
      container.start();
      container.attach(
        { stream: true, stdout: true, stderr: true },
        function (err, stream) {
          stream.pipe(process.stdout);
        }
      );
    })
    .catch((err: Error) => console.log(err));

  res.send({
    message: `container: ${containerName}, buildId: ${buildId}, resourceId: ${resourceId}`,
  });
}

export { generateCode };
