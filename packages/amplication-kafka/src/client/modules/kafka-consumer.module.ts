import {KafkaClient} from "../kafka-client";
import {Module} from "@nestjs/common";
import { ConfigModule, ConfigService } from '@nestjs/config';

import {KafkaClientModule} from "./kafka-client.module";
import {KafkaConsumerConfigDto} from "../dtos/kafka-consumer-config.dto";
import {KafkaConsumer} from "../kafka.consumer";
import {KAFKA_KEY_SERIALIZER, KAFKA_VALUE_SERIALIZER} from "../types/serializer";
import {StringSerializerService} from "../services/string-serializer.service";
import {AmplicationLoggerModule} from "@amplication/nest-logger-module";

@Module({
    imports: [ConfigModule,KafkaClientModule,AmplicationLoggerModule],
    providers: [{
        provide: KafkaConsumerConfigDto,
        useFactory: (configService: ConfigService) => {
            const groupId = configService.get(KafkaConsumerConfigDto.ENV_KAFKA_GROUP_ID);
            const concurencyFactor = configService.get(KafkaConsumerConfigDto.ENV_KAFKA_CONSUMER_CONCURENCY_FACTOR);
            return new KafkaConsumerConfigDto(groupId, concurencyFactor)
        }
    },{
        provide: KAFKA_KEY_SERIALIZER,
        useClass: StringSerializerService
    },{
        provide: KAFKA_VALUE_SERIALIZER,
        useClass: StringSerializerService
    }],
    exports: [KafkaConsumer]
})
export class KafkaConsumerModule {}

