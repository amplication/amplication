import {BeforeApplicationShutdown, Inject, Injectable, OnApplicationBootstrap} from "@nestjs/common";
import {Producer} from "kafkajs";
import {
    PRODUCER_KAFKA_KEY_SERIALIZER,
    PRODUCER_KAFKA_VALUE_SERIALIZER,
    Serializer
} from './types';
import {EmitResponse} from './dtos';
import {KafkaClient} from './kafka-client';
import {AMPLICATION_LOGGER_PROVIDER, AmplicationLogger} from "@amplication/nest-logger-module";

@Injectable()
export class KafkaProducer<K,V> implements OnApplicationBootstrap, BeforeApplicationShutdown {

    private producer: Producer;

    constructor(kafkaClient:KafkaClient,
                @Inject(PRODUCER_KAFKA_KEY_SERIALIZER) private keySerialize: Serializer<K>,
                @Inject(PRODUCER_KAFKA_VALUE_SERIALIZER) private valueSerialize: Serializer<V>,
                @Inject(AMPLICATION_LOGGER_PROVIDER) private logger: AmplicationLogger) {
        this.producer = kafkaClient.kafka.producer()
    }

    async beforeApplicationShutdown(signal?: string): Promise<any> {
        this.logger.warn(`Kafka client received ${signal} exit. disconnecting client...`)
        await this.producer.disconnect()
    }

    async onApplicationBootstrap(): Promise<any> {
        this.logger.info(`Producer connecting to kafka:`)
        await this.producer.connect()
    }

    public async emit(topic: string, key: K, message: V, headers?: { [key: string]: string }, partition?: number): Promise<EmitResponse> {
        const response = await this.producer.send({
            topic: topic,
            messages: [{
                key: this.keySerialize.serialize(key),
                value: this.valueSerialize.serialize(message),
                headers: headers,
                partition: partition,
                timestamp: new Date().valueOf().toString()
            }],
        })

        return {
            partition: response[0].partition,
            offset: response[0].offset
        }
    }
}