import {Kafka} from "kafkajs";
import {KafkaConfigDto} from "./dtos/kafka-config.dto";

export class KafkaClient {

    private readonly _kafka: Kafka

    constructor(private config: KafkaConfigDto) {
        this._kafka = new Kafka({
            clientId: config.clientId,
            brokers: config.brokers,
        })
    }

    get kafka(): Kafka {
        return this._kafka;
    }
}
