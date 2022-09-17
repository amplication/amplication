import {Injectable} from "@nestjs/common";

@Injectable()
export class KafkaConfigDto {

    public static ENV_KAFKA_BROKERS = "KAFKA_BROKERS"
    public static ENV_KAFKA_CLIENT_ID = "KAFKA_CLIENT_ID"
    private readonly _brokers: string[]
    private readonly _clientId: string;

    constructor(brokers: string, clientId: string) {
        this._brokers = KafkaConfigDto.parseBrokersJson(brokers)
        if(!KafkaConfigDto.isValidStringArray(this._brokers)){
            throw new Error(`Kafka Config[${KafkaConfigDto.ENV_KAFKA_BROKERS}] - Brokers value is not array: ${brokers}`)
        }
        if(clientId){
            this._clientId = clientId
        } else {
            throw new Error(`Kafka Config[${KafkaConfigDto.ENV_KAFKA_CLIENT_ID}] - Missing client ID: ${clientId}`)
        }
    }

    get brokers(): string[] {
        return this._brokers;
    }

    get clientId(): string {
        return this._clientId;
    }

    private static parseBrokersJson(brokers:string): any {
        try{
            return JSON.parse(brokers)
        } catch (_){
            throw new Error(`Kafka Config[${KafkaConfigDto.ENV_KAFKA_BROKERS}] - Brokers value is not a valid json: ${brokers}`)
        }
    }

    private static isValidStringArray(brokers: string[]):boolean {
        return Array.isArray(brokers) && brokers.some(value => "string" == typeof value)
    }

}