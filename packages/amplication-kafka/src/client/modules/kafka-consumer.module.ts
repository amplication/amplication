import {KafkaClient} from "../kafka-client";
import {Module} from "@nestjs/common";
import { ConfigModule, ConfigService } from '@nestjs/config';

import {KafkaClientModule} from "./kafka-client.module";
import {KafkaConsumerConfigDto} from "../dtos/kafka-consumer-config.dto";

@Module({
    imports: [ConfigModule,KafkaClientModule],
    providers: [{
        provide: KafkaConsumerConfigDto,
        useFactory: (configService: ConfigService) => {
            const groupId = configService.get(KafkaConsumerConfigDto.ENV_KAFKA_GROUP_ID);
            const concurencyFactor = configService.get(KafkaConsumerConfigDto.ENV_KAFKA_CONSUMER_CONCURENCY_FACTOR);
            return new KafkaConsumerConfigDto(groupId, concurencyFactor)
        }
    },KafkaClient],
    exports: []
})
export class AccountModule {}

