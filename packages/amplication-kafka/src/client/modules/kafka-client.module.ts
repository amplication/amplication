import {KafkaClient} from "../kafka-client";
import {Module} from "@nestjs/common";
import { ConfigModule, ConfigService } from '@nestjs/config';

import {KafkaConfigDto} from "../dtos";

@Module({
    imports: [ConfigModule],
    providers: [{
        provide: KafkaConfigDto,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
            const brokers = configService.get(KafkaConfigDto.ENV_KAFKA_BROKERS);
            const clientId = configService.get(KafkaConfigDto.ENV_KAFKA_CLIENT_ID);
            return new KafkaConfigDto(brokers, clientId)
        }
    }, KafkaClient],
    exports: [KafkaConfigDto,KafkaClient]
})
export class KafkaClientModule {}

