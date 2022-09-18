import {DynamicModule, Module, Type} from "@nestjs/common";
import { ConfigModule, ConfigService } from '@nestjs/config';

import {KafkaClientModule} from "./kafka-client.module";
import {KafkaConsumerConfigDto} from "../dtos";
import {KafkaConsumer} from "../kafka.consumer";
import {CONSUMER_KAFKA_KEY_SERIALIZER, CONSUMER_KAFKA_VALUE_SERIALIZER} from "../types";
import {AmplicationLoggerModule} from "@amplication/nest-logger-module";

@Module({})
export class KafkaConsumerModule {
    public static registerAsync<K, V>(keySerializerClass: Type<K>,
                                      valueSerializerClass: Type<V>): DynamicModule {
        return {
            module: KafkaConsumerModule,
            imports: [ConfigModule, KafkaClientModule, AmplicationLoggerModule.register({
                metadata: {
                    service: "kafka-consumer-module"
                }
            })],
            providers: [{
                provide: KafkaConsumerConfigDto,
                useFactory: (configService: ConfigService) => {
                    const groupId = configService.get(KafkaConsumerConfigDto.ENV_KAFKA_GROUP_ID);
                    const concurencyFactor = configService.get(KafkaConsumerConfigDto.ENV_KAFKA_CONSUMER_CONCURENCY_FACTOR);
                    return new KafkaConsumerConfigDto(groupId, concurencyFactor)
                }
            }, {
                provide: CONSUMER_KAFKA_KEY_SERIALIZER,
                useClass: keySerializerClass
            }, {
                provide: CONSUMER_KAFKA_VALUE_SERIALIZER,
                useClass: valueSerializerClass
            }],
            exports: [KafkaConsumer]
        }
    }

}

