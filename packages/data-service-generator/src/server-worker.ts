import { parentPort } from "worker_threads";
import { createServer } from "./server/create-server";
import DsgContext from "./dsg-context";

if (parentPort) {
  parentPort.on("message", async () => {
    const serverContext = DsgContext.getInstance;
    await serverContext.logger.info("createServerWorker");
    const serverModules = await createServer();
  });
}
