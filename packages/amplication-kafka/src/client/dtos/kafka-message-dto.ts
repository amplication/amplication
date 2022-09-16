export interface KafkaMessageDto<K,V> {
    value: V
    key?: K
    headers: Map<string,string>
    partition: number,
    offset: string
    topic: string
}
