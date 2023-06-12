import { DynamicModule, Module } from "@nestjs/common";
import {
  OpenTelemetryModule,
  OpenTelemetryModuleAsyncOption,
  ControllerInjector,
  EventEmitterInjector,
  GuardInjector,
  PipeInjector,
  ScheduleInjector,
} from "@overbit/opentelemetry-nestjs";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import type { OpenTelemetryModuleConfig } from "@overbit/opentelemetry-nestjs/dist/OpenTelemetryModuleConfig.interface";
import { AWSXRayPropagator } from "@opentelemetry/propagator-aws-xray";
import { AWSXRayIdGenerator } from "@opentelemetry/id-generator-aws-xray";
import { AwsInstrumentation } from "@opentelemetry/instrumentation-aws-sdk";
import { KafkaJsInstrumentation } from "opentelemetry-instrumentation-kafkajs";
import { CompositePropagator } from "@opentelemetry/core";

@Module({
  imports: [],
  controllers: [],
  providers: [],
  exports: [],
})
export class TracingModule extends OpenTelemetryModule {
  private static addAwsXRayConfiguration(
    configuration?: Partial<OpenTelemetryModuleConfig>
  ): Partial<OpenTelemetryModuleConfig> {
    configuration.instrumentations = configuration.instrumentations || [];
    configuration.instrumentations.push(
      new AwsInstrumentation({
        suppressInternalInstrumentation: true,
        sqsExtractContextPropagationFromPayload: true,
      })
    );

    const traceExporter = new OTLPTraceExporter();

    return {
      ...configuration,
      textMapPropagator: new CompositePropagator({
        propagators: [new AWSXRayPropagator()],
      }),
      spanProcessor: new BatchSpanProcessor(traceExporter),
      traceExporter,
      idGenerator: new AWSXRayIdGenerator(),
    };
  }

  private static addLocalConfiguration(
    configuration?: Partial<OpenTelemetryModuleConfig>
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
    configuration?: Partial<OpenTelemetryModuleConfig>
  ): Partial<OpenTelemetryModuleConfig> {
    configuration.traceAutoInjectors = configuration.traceAutoInjectors || [];
    configuration.traceAutoInjectors.push(
      ControllerInjector,
      GuardInjector,
      EventEmitterInjector,
      ScheduleInjector,
      PipeInjector
    );

    configuration.instrumentations = configuration.instrumentations || [];
    configuration.instrumentations.push(new KafkaJsInstrumentation({}));
    return configuration;
  }

  static forRoot(
    configuration?: Partial<OpenTelemetryModuleConfig>
  ): Promise<DynamicModule> {
    const commonConfiguration = this.createDefaultConfiguration(configuration);
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
      ...configuration,
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
