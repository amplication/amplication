import { mock } from "jest-mock-extended";
import { PrismaService } from "nestjs-prisma";
import { HealthServiceBase } from "../../health/base/health.service.base";

describe("Testing the HealthServiceBase", () => {
  //ARRANGE
  const prismaService = mock<PrismaService>();
  const healthServiceBase = new HealthServiceBase(prismaService);

  describe("Testing the isDbReady function in HealthServiceBase class", () => {
    beforeEach(() => {
      prismaService.$queryRaw.mockClear();
    });
    it("should return true if allow connection to db", async () => {
      //ARRANGE
      prismaService.$queryRaw
        //@ts-ignore
        .mockReturnValue(Promise.resolve(true));
      //ACT
      const response = await healthServiceBase.isDbReady();
      //ASSERT
      expect(response).toBe(true);
    });
    it("should return false if db is not available", async () => {
      //ARRANGE
      prismaService.$queryRaw
        //@ts-ignore
        .mockReturnValue(Promise.reject(false));
      //ACT
      const response = await healthServiceBase.isDbReady();
      console.log(response);

      //ASSERT
      expect(response).toBe(false);
    });
  });
});
