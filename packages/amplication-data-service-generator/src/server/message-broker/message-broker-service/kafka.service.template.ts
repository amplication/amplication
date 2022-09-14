import { Injectable } from "@nestjs/common";
//@ts-ignore
import { KafkaServiceBase } from "./base/kafka.service.base";

@Injectable()
export class KafkaService extends KafkaServiceBase {}
