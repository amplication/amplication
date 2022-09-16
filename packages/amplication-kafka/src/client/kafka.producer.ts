import {BeforeApplicationShutdown, Injectable, OnApplicationBootstrap} from "@nestjs/common";
import {Producer, Kafka} from "kafkajs";
import {KafkaConsumerConfigDto} from "./dtos/kafka-consumer-config.dto";
import {KeySerializer} from "./types/key-serializer";
import {ValueSerializer} from "./types/value-serializer";
import {Logger} from "winston";
import {EmitResponse} from "./dtos/emit-response";
import {KafkaClient} from "./kafka-client";

@Injectable()
export class KafkaProducer<K,V> implements OnApplicationBootstrap, BeforeApplicationShutdown {

    private producer: Producer;

    constructor(kafkaClient:KafkaClient,
                private config: KafkaConsumerConfigDto,
                private keySerialize: KeySerializer<K>,
                private valueSerialize: ValueSerializer<V>,
                private logger: Logger) {
        this.producer = kafkaClient.kafka.producer()
    }

    async beforeApplicationShutdown(signal?: string): Promise<any> {
        this.logger.warn(`Kafka client received ${signal} exit. disconnecting client...`,this.config)
        await this.producer.disconnect()
    }

    async onApplicationBootstrap(): Promise<any> {
        this.logger.info(`Producer connecting to kafka:`, {
            ...this.config
        })
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