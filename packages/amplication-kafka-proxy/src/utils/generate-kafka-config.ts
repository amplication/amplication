import { KafkaOptions, Transport } from '@nestjs/microservices';

export const generateKafkaConfig = (): KafkaOptions => {
  console.log('env', process.env.KAFKA_BROKERS);
  const brokers = process.env.KAFKA_BROKERS;

  return {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'kafka-proxy',
        brokers: [...brokers.split(',')],
        ssl: false,
      },
      producer: {
        metadataMaxAge: 3000,
      },
    },
  };
};
