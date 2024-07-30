import { KafkaPacemaker } from "./pacemaker.service";

describe("KafkaPacemaker", () => {
  it("should wrap a long running method with heartbeat and return the result of the method", async () => {
    const mockedHeartbeat = jest.fn();
    const kafkaContext = {
      getHeartbeat: jest.fn().mockReturnValue(mockedHeartbeat),
    };

    const expectedHeartbeatCalls = 10;
    const timeout = 100;
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const fn = jest.fn().mockImplementation(async () => {
      await sleep(timeout * expectedHeartbeatCalls + 1);
      return "Test Complete";
    });

    const result = await KafkaPacemaker.wrapLongRunningMethod(
      kafkaContext as any,
      fn,
      timeout
    );

    expect(fn).toHaveBeenCalledTimes(1);
    expect(result).toBe("Test Complete");
    expect(mockedHeartbeat).toHaveBeenCalledTimes(expectedHeartbeatCalls);
  });

  it("should throw the fn() exception when the fn() fails", async () => {
    const mockedHeartbeat = jest.fn();
    const kafkaContext = {
      getHeartbeat: jest.fn().mockReturnValue(mockedHeartbeat),
    };

    const timeout = 100;

    const expectedError = new Error("Invalid data");
    const fn = jest.fn().mockRejectedValue(expectedError);

    await expect(
      KafkaPacemaker.wrapLongRunningMethod(kafkaContext as any, fn, timeout)
    ).rejects.toThrow(expectedError);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  describe("when the heartbeat fails", () => {
    const mockedHeartbeat = jest
      .fn()
      .mockRejectedValue(new Error("Failed to connect to Kafka"));

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should wrap a long running method with heartbeat and return the result of the method", async () => {
      const kafkaContext = {
        getHeartbeat: jest.fn().mockReturnValue(mockedHeartbeat),
      };

      const expectedHeartbeatCalls = 10;
      const timeout = 100;
      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      const fn = jest.fn().mockImplementation(async () => {
        await sleep(timeout * expectedHeartbeatCalls + 1);
        return "Test Complete";
      });

      const result = await KafkaPacemaker.wrapLongRunningMethod(
        kafkaContext as any,
        fn,
        timeout
      );

      expect(fn).toHaveBeenCalledTimes(1);
      expect(result).toBe("Test Complete");
      expect(mockedHeartbeat).toHaveBeenCalledTimes(expectedHeartbeatCalls);
    });

    it("should throw the fn() exception when the fn() fails", async () => {
      const kafkaContext = {
        getHeartbeat: jest.fn().mockReturnValue(mockedHeartbeat),
      };

      const timeout = 100;

      const expectedError = new Error("Invalid data");
      const fn = jest.fn().mockRejectedValue(expectedError);

      await expect(
        KafkaPacemaker.wrapLongRunningMethod(kafkaContext as any, fn, timeout)
      ).rejects.toThrow(expectedError);

      expect(mockedHeartbeat).toHaveBeenCalledTimes(0);

      expect(fn).toHaveBeenCalledTimes(1);
    });
  });
});
