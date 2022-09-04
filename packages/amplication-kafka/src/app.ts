import {Producer} from "kafkajs";
const { Kafka } = require('kafkajs')
import {Subject} from 'rxjs';
import {Consumer} from "@nestjs/microservices/external/kafka.interface";

interface EmitResponse  { partition: number, offset?:string}
class StringSerializer implements KeySerialize<string>, ValueSerialize<string> {
    public serialize(key: string): string {
        return key
    }

    deserialize(key: Buffer): string {
        return key.toString()
    }
}

interface KeySerialize<T>{
    serialize(key:T):string
    deserialize(key:Buffer):T
}

interface ValueSerialize<T>{
    serialize(value:T):string
    deserialize(value:Buffer | null):T
}
class KafkaStringTopicProducer {
    constructor(private topic: string, private kafkaProducer: KafkaClient<string, string>) {
    }
    public async shutdown(): Promise<void> {
      await this.kafkaProducer.shutdown()
    }
    public async emit(message: string,key?: string, headers?: { [key: string]: string }, partition?: number) : Promise<EmitResponse> {
        //TODO: Remove ||
        return await this.kafkaProducer.emit(this.topic,key || "", message, headers, partition)
    }
}


class KafkaTopicProducer<K,V>{
    constructor(private topic:string,private kafkaProducer:KafkaClient<K,V>) {
    }

    public emit(key:K,message:V,headers?:{[key:string]:string},partition?:number){
        this.kafkaProducer.emit(this.topic,key,message,headers,partition)
    }
}
interface KafkaConfigurations{
    clientId:string,
    brokers:string[]
    consumer: {
        groupId: string,
        topics: string[]
    }
}

interface KafkaMessage<K,V> {
    value: V
    key?: K
    headers?: { [key: string]: string }
    partition: number,
    offset: string
    topic: string
}

class KafkaClient<K,V>{
    private producer: Producer
    private connecting: boolean = false
    private connected: boolean = false
    private subject$: Subject<void>;
    private consumers: {[key:string]:((kafkaMessage:KafkaMessage<K,V>)=>Promise<void>)[]} = {};
    private consumer: Consumer;

    constructor(private producerConfigurations:KafkaConfigurations,
                private keySerialize:KeySerialize<K>,
                private valueSerialize:ValueSerialize<V>) {

        const kafka = new Kafka({
            clientId: producerConfigurations.clientId,
            brokers: producerConfigurations.brokers,
        })
        this.consumer = kafka.consumer({
            groupId: 'group',
        })
        this.producer = kafka.producer()
        this.subject$ = new Subject<void>();

    }


    public pause(topic:string,partition:number,timeout:number=300) {
        this.consumer.pause([{
            topic,
            partitions: [partition]
        }])
        setTimeout(() => {
            this.consumer.resume([{
                topic,
                partitions: [partition]
            }])
        }, timeout)
    }

    public rollback(kafkaMessage:KafkaMessage<K, V>):void{
        return this.consumer.seek({
            topic: kafkaMessage.topic,
            partition: kafkaMessage.partition,
            offset: kafkaMessage.offset,
        })
    }

    public commit(kafkaMessage:KafkaMessage<K, V>):Promise<void> {
        return this.consumer.commitOffsets([{
            topic: kafkaMessage.topic,
            partition: kafkaMessage.partition,
            offset: kafkaMessage.offset,
        }])
    }


    private async connectConsumer(){
        await this.consumer.connect()
        await Promise.all(this.producerConfigurations.consumer.topics.map(topic=> {
            return this.consumer.subscribe({topic})
        }))

        const consumers: {[key:string]:((kafkaMessage:KafkaMessage<K,V>)=>Promise<void>)[]} = this.consumers
        const keySerialize = this.keySerialize
        const valueSerialize = this.valueSerialize

        await this.consumer.run({
            partitionsConsumedConcurrently: 3,
            autoCommit: false,
            async eachMessage({
                                  topic,
                                  partition,
                                  message: {
                                      key: _key,
                                      headers,
                                      offset,
                                      value: _value,
                                  },
                              }): Promise<void> {
                const key: K = keySerialize.deserialize(_key)
                const value: V = valueSerialize.deserialize(_value)
                for (const header in headers) {
                    console.log(header)
                }
                if (consumers[topic]) {
                    try {
                        await Promise.all(consumers[topic].map(async (callback: (kafkaMessage: KafkaMessage<K, V>) => Promise<void>) => {
                            try {
                                return await callback({
                                    key,
                                    value,
                                    partition,
                                    offset,
                                    topic,
                                })
                            } catch (err){
                                throw err;
                            }
                        }))
                    } catch (err) {
                        console.error("ROLLING BACK MESSAGE")
                    }
                }
            }
        })
    }

    public async subscribe(topic:string,callback:(kafkaMessage:KafkaMessage<K,V>)=>Promise<void>) {
        await this.connectConsumer()
        if(!this.consumers[topic]){
            this.consumers[topic] = []
        }
        this.consumers[topic].push(callback)
    }

    public async shutdown(){
        console.warn("Kafka client is shutting down, disconnecting client...")
        await this.producer.disconnect()
    }

    private async subscribeForConnection():Promise<void>{
        return new Promise<void>((resolve, reject) => {
            this.subject$.subscribe({
                complete() {
                    resolve()
                },
                next() {
                },
                error(error) {
                    reject(error)
                }
            })
        })
    }

    private async connect(): Promise<void> {
        if (!this.connected) {
            if (!this.connecting) {
                this.connecting = true
                try {
                    await this.producer.connect()
                    process.on('exit', async () => {
                        console.warn("Kafka client received exit. disconnecting client...")
                        await this.producer.disconnect()
                    });
                    process.on('SIGINT', async () => {
                        console.warn("Kafka client received SIGINT. disconnecting client...")
                        await this.producer.disconnect()
                    });
                    this.connected = true
                    this.connecting = false
                } catch (err) {
                    this.connecting = false
                    this.connected = false
                    throw { message: "error",cause:err}
                }
            } else {
                return this.subscribeForConnection()
            }
        }
    }

    public async emit(topic:string,key:K,message:V,headers?:{[key:string]:string},_partition?:number):Promise<EmitResponse>{
        await this.connect()
        const { partition:partition, offset: offset } = (await this.producer.send({
            topic: topic,
            messages: [{
                key: this.keySerialize.serialize(key),
                value: this.valueSerialize.serialize(message),
                headers: headers,
                partition: _partition,
                timestamp: new Date().valueOf().toString()
            }],
        }))[0]
        return {
            partition,
            offset
        }
    }
}

async function test() {
    const kafka = new KafkaClient({
        clientId: "app-1",
        brokers: ["localhost:9092"],
        consumer: {
            topics: ["test-topic"],
            groupId: "group"
        }
    }, new StringSerializer(), new StringSerializer())

    const producer = new KafkaStringTopicProducer("test-topic", kafka)
    try {
        await kafka.subscribe("test-topic", async (kafkaMessage) => {
            const {
                key,
                value,
                partition,
                offset,
                headers,
                topic
            } = kafkaMessage
            console.log("MATAN",kafkaMessage)
            await new Promise<void>(resolve => {
                setTimeout(()=>resolve(),5000)
            })


            // if (partition === 1) {
                // console.log(`REJECT MESSAGE key:${key},value:${value},partition:${partition},offset:${offset},headers:${headers},`)
                // kafka.rollback(kafkaMessage)
                // kafka.pause(topic,partition)
            // } else {
            kafka.commit(kafkaMessage)
            // }
        })
    } catch (err) {
        console.error(err)
    }




    console.log(await producer.emit("test-0", "key-0"))
    console.log(await producer.emit("test-1", "key-0"))
    console.log(await producer.emit("test-2", "key-0"))
    console.log(await producer.emit("test-3", "key-0"))
    console.log(await producer.emit("test-4", "key-0"))
    console.log(await producer.emit("test-5", "key-0"))

    console.log(await producer.emit("test-0", "key-1"))
    console.log(await producer.emit("test-1", "key-1"))
    console.log(await producer.emit("test-2", "key-1"))
    console.log(await producer.emit("test-3", "key-1"))
    console.log(await producer.emit("test-4", "key-1"))
    console.log(await producer.emit("test-5", "key-1"))

    console.log(await producer.emit("test-0", "key-2"))
    console.log(await producer.emit("test-1", "key-2"))
    console.log(await producer.emit("test-2", "key-2"))
    console.log(await producer.emit("test-3", "key-2"))
    console.log(await producer.emit("test-4", "key-2"))
    console.log(await producer.emit("test-5", "key-2"))

    console.log(await producer.emit("test-0", "key-3"))
    console.log(await producer.emit("test-1", "key-3"))
    console.log(await producer.emit("test-2", "key-3"))
    console.log(await producer.emit("test-3", "key-3"))
    console.log(await producer.emit("test-4", "key-3"))
    console.log(await producer.emit("test-5", "key-3"))


    console.log(await producer.emit("test-0", "key-0", {
        "test": "1"
    }))
    console.log(await producer.emit("test-0", "key-1", {
        "test": "test"
    }))
    console.log(await producer.emit("test-0", "key-2", {
        "test": "1"
    }))
    console.log(await producer.emit("test-0", "key-3", {
        "test": "test"
    }))

    producer.shutdown()
}
test()



interface CreateCommitMessage {
    commit: { id: string, message: string },
    build: { id: string, previousBuildId: string },
    repository: { owner: string, name: string, installationId: string }
}