import {KafkaConfigDto} from "./kafka-config.dto";

export class KafkaConsumerConfigDto extends KafkaConfigDto {
    constructor(public groupId: string, public concurencyFactor: number, brokers: string[], clientId: string) {
        super(brokers, clientId);
    }
}