import {IHeaders} from "@nestjs/microservices/external/kafka.interface";

interface Header{
    [key: string]: string
}
const f:Header = { "test" : "value" , "abs" : "value" }
console.log(f["test"])
console.log(Object.entries(f))



