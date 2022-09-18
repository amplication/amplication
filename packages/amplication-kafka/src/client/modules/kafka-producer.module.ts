import {DynamicModule, Module, Type} from "@nestjs/common";
import { ConfigModule} from '@nestjs/config';

import {KafkaClientModule} from "./kafka-client.module";
import {PRODUCER_KAFKA_KEY_SERIALIZER, PRODUCER_KAFKA_VALUE_SERIALIZER} from "../types";
import {KafkaProducer} from "../kafka.producer";
import {AmplicationLoggerModule} from "@amplication/nest-logger-module";

@Module({ })
export class KafkaProducerModule {
    public static registerAsync<K,V>(keySerializerClass:Type<K>,
                                     valueSerializerClass:Type<V>):DynamicModule{
        return {
            module: KafkaProducerModule,
            imports: [ConfigModule,KafkaClientModule,AmplicationLoggerModule],
            providers: [{
                provide: PRODUCER_KAFKA_KEY_SERIALIZER,
                useClass: keySerializerClass
            },{
                provide: PRODUCER_KAFKA_VALUE_SERIALIZER,
                useClass: valueSerializerClass
            }],
            exports: [KafkaProducer]
        }
    }
}

