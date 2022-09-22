import {Injectable} from "@nestjs/common";

@Injectable()
export class KafkaConsumerConfigDto {


    public static ENV_KAFKA_GROUP_ID:string = "KAFKA_GROUP_ID"
    public static ENV_KAFKA_CONSUMER_CONCURENCY_FACTOR:string = "KAFKA_CONSUMER_CONCURENCY_FACTOR"
    public static ENV_KAFKA_AUTO_COMMIT:string = "KAFKA_AUTO_COMMIT"
    private readonly _groupId: string;
    private readonly _concurencyFactor?: number;
    private readonly _autoCommit?: boolean;

    constructor(groupId: string, concurencyFactor: string, autoCommit:boolean) {
        if (groupId) {
            this._groupId = groupId
        } else {
            throw new Error(`Kafka Config[${KafkaConsumerConfigDto.ENV_KAFKA_GROUP_ID}] - Group ID is missing: ${groupId}`)
        }

        if (concurencyFactor) {
            try {
                this._concurencyFactor = Number(concurencyFactor)
            } catch (_) {
                throw new Error(`Kafka Config[${KafkaConsumerConfigDto.ENV_KAFKA_CONSUMER_CONCURENCY_FACTOR}] - Concurency factor expected to be a number: ${concurencyFactor}`)
            }
        }

        if (autoCommit) {
            try {
                this._autoCommit = Boolean(autoCommit)
            } catch (_) {
                throw new Error(`Kafka Config[${KafkaConsumerConfigDto.ENV_KAFKA_AUTO_COMMIT}] - Auto commit expected to be a boolean: ${autoCommit}`)
            }
        }
    }

    get groupId(): string {
        return this._groupId;
    }

    get concurencyFactor(): number | undefined {
        return this._concurencyFactor;
    }
    
    get autoCommit(): boolean | undefined{
        return this._autoCommit;
    }
}