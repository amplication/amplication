import {Kafka} from 'kafkajs';
import {KafkaConfigDto} from './dtos';
import {Injectable} from '@nestjs/common';

@Injectable()
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
