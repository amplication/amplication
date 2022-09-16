export class KafkaConfigDto {
    constructor(public brokers: string[], public clientId: string) {
    }
}