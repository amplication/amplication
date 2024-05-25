import { AwsEksDetector } from "@opentelemetry/resource-detector-aws";
import { AwsInstrumentation } from "@opentelemetry/instrumentation-aws-sdk";
import { AWSXRayIdGenerator } from "@opentelemetry/id-generator-aws-xray";
import { AWSXRayPropagator } from "@opentelemetry/propagator-aws-xray";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { CompositePropagator } from "@opentelemetry/core";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
// import { KafkaJsInstrumentation } from "opentelemetry-instrumentation-kafkajs";
import {
  Tracing as OtelTracing,
  TracingDefaultConfig,
} from "@amplication/opentelemetry-nestjs";
import { TracingConfig } from "@amplication/opentelemetry-nestjs";

const addAwsXRayConfiguration = (
  configuration: TracingConfig
): TracingConfig => {
  const traceExporter = new OTLPTraceExporter();

  configuration = {
    ...TracingDefaultConfig,
    ...configuration,
  };

  return {
    ...configuration,
    instrumentations: [
      ...(configuration.instrumentations || []),
      new AwsInstrumentation({
        suppressInternalInstrumentation: true,
        sqsExtractContextPropagationFromPayload: true,
      }),
    ],
    resourceDetectors: [
      ...(configuration.resourceDetectors || []),
      new AwsEksDetector(),
    ],
    textMapPropagator: new CompositePropagator({
      propagators: [new AWSXRayPropagator()],
    }),
    spanProcessor: new BatchSpanProcessor(traceExporter),
    traceExporter,
    idGenerator: new AWSXRayIdGenerator(),
  };
};

const addLocalConfiguration = (configuration: TracingConfig): TracingConfig => {
  const traceExporter = new OTLPTraceExporter({});
  configuration = {
    ...TracingDefaultConfig,
    ...configuration,
  };

  return {
    ...configuration,
    instrumentations: [...configuration.instrumentations],
    spanProcessor: new BatchSpanProcessor(traceExporter),
    traceExporter,
  };
};

export class Tracing extends OtelTracing {
  static init(configuration: TracingConfig): void {
    configuration.instrumentations = [
      // new KafkaJsInstrumentation({}),
    ];
    const sdkConfig =
      process.env.NODE_ENV === "production" || process.env.DEBUG_XRAY
        ? addAwsXRayConfiguration(configuration)
        : addLocalConfiguration(configuration);

    super.init(sdkConfig);
  }
}
