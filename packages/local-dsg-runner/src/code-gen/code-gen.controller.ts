import { Request, Response } from "express";
import Docker from "dockerode";

function generateCode(req: Request, res: Response) {
  const { resourceId, buildId } = req.body;

  const imageName = "amplication/data-service-generator-runner";
  const containerName = `dsg-runner-${buildId}`;
  const dsgJobFolder = `${process.cwd()}/${
    process.env.DSG_JOBS_BASE_FOLDER
  }/${buildId}`;
  const buildOutputPath = process.env.BUILD_OUTPUT_PATH;

  const docker = new Docker();

  docker
    .createContainer({
      Image: imageName,
      name: containerName,
      Volumes: { [buildOutputPath]: {} },
      HostConfig: {
        Binds: [`${dsgJobFolder}:${buildOutputPath}`],
        // AutoRemove: true,
      },
      Cmd: ["node ./src/main.js"],
      Env: [
        "BUILD_OUTPUT_PATH=/dsg-job/code",
        `BUILD_ID=${buildId}`,
        `RESOURCE_ID=${resourceId}`,
      ],
    })
    .then((container: Docker.Container) => container.start())
    .catch((err: Error) => console.log(err));

  res.send({
    message: `container: ${containerName}, buildId: ${buildId}, resourceId: ${resourceId}`,
  });
}

export { generateCode };
