import {KafkaClient} from "../kafka-client";
import {Module} from "@nestjs/common";
import { ConfigModule} from '@nestjs/config';

import {KafkaClientModule} from "./kafka-client.module";
import {KAFKA_KEY_SERIALIZER, KAFKA_VALUE_SERIALIZER} from "../types/serializer";
import {StringSerializerService} from "../services/string-serializer.service";
import {KafkaProducer} from "../kafka.producer";
import {AmplicationLoggerModule} from "@amplication/nest-logger-module";

@Module({
    imports: [ConfigModule,KafkaClientModule,AmplicationLoggerModule],
    providers: [{
        provide: KAFKA_KEY_SERIALIZER,
        useClass: StringSerializerService
    },{
        provide: KAFKA_VALUE_SERIALIZER,
        useClass: StringSerializerService
    }],
    exports: [KafkaProducer]
})
export class KafkaProducerModule {}

