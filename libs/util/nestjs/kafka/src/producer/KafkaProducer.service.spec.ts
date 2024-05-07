import { Test, TestingModule } from "@nestjs/testing";
import { ClientKafka } from "@nestjs/microservices";

import { KAFKA_CLIENT } from "../createNestjsKafkaConfig";
import { KafkaProducerService } from "./KafkaProducer.service";
import {
  IKafkaMessageSerializer,
  KAFKA_SERIALIZER,
  DecodedKafkaMessage,
  KafkaMessage,
  SchemaIds,
} from "@amplication/util/kafka";
import { of } from "rxjs";

describe("KafkaProducerService", () => {
  let service: KafkaProducerService;
  let kafkaClient: ClientKafka;
  let serializer: IKafkaMessageSerializer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KafkaProducerService,
        {
          provide: KAFKA_CLIENT,
          useValue: {
            emit: jest.fn().mockReturnValue(of(null)),
          },
        },
        {
          provide: KAFKA_SERIALIZER,
          useValue: {
            serialize: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<KafkaProducerService>(KafkaProducerService);
    kafkaClient = module.get<ClientKafka>(KAFKA_CLIENT);
    serializer = module.get<IKafkaMessageSerializer>(KAFKA_SERIALIZER);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("emitMessage", () => {
    const topic = "test-topic";
    const message: DecodedKafkaMessage = {
      key: "test-id",
      value: { data: "test-data" },
    };
    const schemaIds: SchemaIds = {
      keySchemaId: 1,
      valueSchemaId: 2,
    };

    it("should emit message to kafka client with serialized message", async () => {
      const serializedMessage: KafkaMessage = {
        key: Buffer.from("test-key"),
        value: Buffer.from("test-value"),
      };
      jest.spyOn(serializer, "serialize").mockResolvedValue(serializedMessage);

      await service.emitMessage(topic, message, schemaIds);

      expect(serializer.serialize).toHaveBeenCalledWith(message, schemaIds);
      expect(kafkaClient.emit).toHaveBeenCalledWith(topic, serializedMessage);
    });

    it("should resolve promise when kafka client emits the message successfully", async () => {
      jest.spyOn(kafkaClient, "emit").mockReturnValue(of(null));

      await expect(
        service.emitMessage(topic, message, schemaIds)
      ).resolves.toBeUndefined();
    });
  });
});
