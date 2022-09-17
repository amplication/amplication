import {Injectable} from "@nestjs/common";

@Injectable()
export class KafkaConsumerConfigDto {

    public static ENV_KAFKA_GROUP_ID:string
    public static ENV_KAFKA_CONSUMER_CONCURENCY_FACTOR:string
    private readonly _groupId: string;
    private readonly _concurencyFactor?: number;

    constructor(groupId: string, concurencyFactor: string) {
        if (groupId) {
            this._groupId = groupId
        } else {
            throw new Error(`Kafka Config[${KafkaConsumerConfigDto.ENV_KAFKA_GROUP_ID}] - Group ID is missing: ${groupId}`)
        }
        try {
            if (concurencyFactor) {
                this._concurencyFactor = Number(concurencyFactor)
            }
        } catch (_) {
            throw new Error(`Kafka Config[${KafkaConsumerConfigDto.ENV_KAFKA_CONSUMER_CONCURENCY_FACTOR}] - Concurency factor expected to be a number: ${concurencyFactor}`)
        }
    }

    get groupId(): string {
        return this._groupId;
    }

    get concurencyFactor(): number | undefined {
        return this._concurencyFactor;
    }
}