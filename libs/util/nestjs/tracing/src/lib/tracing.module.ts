import { DynamicModule, Module } from "@nestjs/common";
import {
  OpenTelemetryModuleDefaultConfig,
  OpenTelemetryModule,
  OpenTelemetryModuleAsyncOption,
} from "@amplication/opentelemetry-nestjs";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { BatchSpanProcessor, Span } from "@opentelemetry/sdk-trace-base";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import type { OpenTelemetryModuleConfig } from "@amplication/opentelemetry-nestjs";
import { AWSXRayPropagator } from "@opentelemetry/propagator-aws-xray";
import { AWSXRayIdGenerator } from "@opentelemetry/id-generator-aws-xray";
import { AwsInstrumentation } from "@opentelemetry/instrumentation-aws-sdk";
import { KafkaJsInstrumentation } from "opentelemetry-instrumentation-kafkajs";
import { AwsEksDetector } from "@opentelemetry/resource-detector-aws";
import { CompositePropagator } from "@opentelemetry/core";
import { PrismaInstrumentation } from "@prisma/instrumentation";
import { ClientRequest } from "node:http";

@Module({
  imports: [],
  controllers: [],
  providers: [],
  exports: [],
})
export class TracingModule extends OpenTelemetryModule {
  private static addAwsXRayConfiguration(
    configuration: Partial<OpenTelemetryModuleConfig>
  ): Partial<OpenTelemetryModuleConfig> {
    const traceExporter = new OTLPTraceExporter();

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
  }

  private static addLocalConfiguration(
    configuration: Partial<OpenTelemetryModuleConfig>
  ): Partial<OpenTelemetryModuleConfig> {
    const collectorOptions = {
      // url is optional and can be omitted - default is http://localhost:4318/v1/traces,
      // url: '<opentelemetry-collector-url>',
    };
    const traceExporter = new OTLPTraceExporter(collectorOptions);

    return {
      ...configuration,
      spanProcessor: new BatchSpanProcessor(traceExporter),
      traceExporter,
    };
  }

  private static createDefaultConfiguration(
    configuration: Partial<OpenTelemetryModuleConfig>
  ): Partial<OpenTelemetryModuleConfig> {
    const autoInstrumentations = getNodeAutoInstrumentations({
      "@opentelemetry/instrumentation-fs": {
        requireParentSpan: true,
        enabled: true,
        createHook: (funtionName, { args }) => {
          return !args[0].toString().indexOf("node_modules");
        },
        endHook: (funtionName, { args, span }) => {
          span.setAttribute("file", args[0].toString());
        },
      },
      "@opentelemetry/instrumentation-http": {
        requireParentforOutgoingSpans: true,
        requestHook: (span: Span, request: ClientRequest) => {
          span.updateName(`${request.method} ${request.path}`);
        },
        enabled: true,
        ignoreIncomingPaths: ["/health", "/_health", "/healthz", "healthcheck"],
      },
      "@opentelemetry/instrumentation-net": {
        enabled: false,
      },
      "@opentelemetry/instrumentation-dns": {
        enabled: false,
      },
      "@opentelemetry/instrumentation-graphql": {
        enabled: true,
        mergeItems: true,
        ignoreTrivialResolveSpans: true,
        depth: 2,
      },
      "@opentelemetry/instrumentation-express": {
        enabled: false,
      },
    });

    configuration = {
      ...configuration,
      instrumentations: [
        autoInstrumentations,
        // new KafkaJsInstrumentation({}),
        // new PrismaInstrumentation({}),
      ],
      traceAutoInjectors:
        configuration?.traceAutoInjectors ||
        OpenTelemetryModuleDefaultConfig.traceAutoInjectors,
    };

    return configuration;
  }

  static forRoot(
    configuration?: Partial<OpenTelemetryModuleConfig>
  ): Promise<DynamicModule> {
    const commonConfiguration = this.createDefaultConfiguration(
      configuration ?? {}
    );
    return OpenTelemetryModule.forRoot(
      process.env.NODE_ENV === "production"
        ? this.addAwsXRayConfiguration(commonConfiguration)
        : this.addLocalConfiguration(commonConfiguration)
    );
  }

  static async forRootAsync(
    configuration?: OpenTelemetryModuleAsyncOption
  ): Promise<DynamicModule> {
    return OpenTelemetryModule.forRootAsync({
      ...(configuration ?? {}),
      useFactory: async (args) => {
        const config = await configuration?.useFactory(args);

        const commonConfiguration = this.createDefaultConfiguration(config);

        return process.env.NODE_ENV === "production"
          ? this.addAwsXRayConfiguration(commonConfiguration)
          : this.addLocalConfiguration(commonConfiguration);
      },
    });
  }
}
