import { mock } from "jest-mock-extended";
import { PrismaService } from "../../prisma/prisma.service";
import { HealthServiceBase } from "../../health/base/health.service.base";

describe("Testing the HealthServiceBase", () => {
  //ARRANGE
  let prismaService: PrismaService;
  let healthServiceBase: HealthServiceBase;

  describe("Testing the isDbReady function in HealthServiceBase class", () => {
    beforeEach(() => {
      prismaService = mock<PrismaService>();
      healthServiceBase = new HealthServiceBase(prismaService);
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
      //ASSERT
      expect(response).toBe(false);
    });
  });
});
