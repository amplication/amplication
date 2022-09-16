import {KafkaMessageDto} from "../dtos/kafka-message-dto";

export type KafkaConsumerCallback<K,V>= (kafkaMessage:KafkaMessageDto<K,V>)=>Promise<void>
