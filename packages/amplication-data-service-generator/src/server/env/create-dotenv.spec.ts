import { createDotEnvModule } from "./create-dotenv";
import { appInfo } from "../../tests/appInfo";
describe("Testing the creation of the .env module", () => {
  describe("Message broker variables", () => {
    it("should add the message broker params if true", async () => {
      // ACT
      const env = await createDotEnvModule(appInfo, "/", true);
      // ASSERT
      expect(env.code).toContain("KAFKA_BROKERS");
      expect(env.code).toContain("KAFKA_ENABLE_SSL");
      expect(env.code).toContain("KAFKA_CLIENT_ID");
      expect(env.code).toContain("KAFKA_GROUP_ID");
    });
    it("should not add the message broker variables if false", async () => {
      // ACT
      const env = await createDotEnvModule(appInfo, "/", false);
      // ASSERT
      expect(env.code.includes("KAFKA_BROKERS")).toBeFalsy();
      expect(env.code.includes("KAFKA_ENABLE_SSL")).toBeFalsy();
      expect(env.code.includes("KAFKA_CLIENT_ID")).toBeFalsy();
      expect(env.code.includes("KAFKA_GROUP_ID")).toBeFalsy();
    });
  });
});
