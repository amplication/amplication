import Docker from "dockerode";
describe("Testing the setup script", () => {
  beforeAll(async () => {
    const docker = new Docker({ port: 3000 });
    console.log("Starting the container build");
    const container = await docker.buildImage("./Dockerfile.test");
  });
  test("server is running", async () => {
    // expect(container);
  });
});
