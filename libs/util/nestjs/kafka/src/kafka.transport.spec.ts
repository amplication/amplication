import { MessageHandler } from "@nestjs/microservices";
import { KafkaCustomTransport } from "./kafka.transport"; // Replace with correct path
import { Consumer } from "@nestjs/microservices/external/kafka.interface";

describe("KafkaCustomTransport", () => {
  let kafkaCustomTransport: KafkaCustomTransport;
  let mockSubscribe: jest.SpyInstance;
  let mockRun: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    kafkaCustomTransport = new KafkaCustomTransport({});
  });

  it("should bind events correctly", async () => {
    mockSubscribe = jest.fn();
    mockRun = jest.fn();

    const mockConsumer: Consumer = {
      subscribe: mockSubscribe,
      run: mockRun,
    } as unknown as Consumer;

    const pattern = "test-pattern";
    const regexp = "/test/";
    kafkaCustomTransport["messageHandlers"].set(pattern, <MessageHandler>{});
    kafkaCustomTransport["messageHandlers"].set(regexp, <MessageHandler>{});

    await kafkaCustomTransport.bindEvents(mockConsumer);

    expect(mockSubscribe).toHaveBeenCalled();
    expect(mockRun).toHaveBeenCalled();
  });

  it("should get handler by pattern or RegExp", () => {
    const patternHandler = jest.fn();
    const regexpHandler = jest.fn();

    const pattern = "test-pattern";
    const regexp = "/test/";

    kafkaCustomTransport["messageHandlers"].set(
      pattern,
      <MessageHandler>patternHandler
    );
    kafkaCustomTransport["messageHandlers"].set(
      regexp,
      <MessageHandler>regexpHandler
    );

    const patternResult = kafkaCustomTransport.getHandlerByPattern(pattern);
    const regexpResult = kafkaCustomTransport.getHandlerByPattern(regexp);

    expect(patternResult).toBe(patternHandler);
    expect(regexpResult).toBe(regexpHandler);
  });

  it("should return null when no handler is found", () => {
    const result = kafkaCustomTransport.getHandlerByPattern(
      "non-existing-pattern"
    );
    expect(result).toBeNull();
  });
});
