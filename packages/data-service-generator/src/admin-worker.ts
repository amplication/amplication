import { parentPort } from "worker_threads";
import { createAdminModules } from "./admin/create-admin";
import DsgContext from "./dsg-context";

if (parentPort) {
  parentPort.on("message", async () => {
    const adminUIContext = DsgContext.getInstance;
    await adminUIContext.logger.info("createAdminWorker");
    const adminUIModules = await createAdminModules();
  });
}
