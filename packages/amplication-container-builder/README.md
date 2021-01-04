# Amplication Container ContainerBuilder

Multi-provider library for building Docker containers.

### Usage

```
npm install @amplication/container-builder
```

The package has multiple modules:

- `@amplication/container-builder`: The main module
- `@amplication/container-builder/dist/docker`: Docker Engine API integration using [dockerode](https://www.npmjs.com/package/dockerode)
- `@amplication/container-builder/dist/cloud-build`: Google Cloud Build integration using [Cloud Build: Node.js Client](https://www.npmjs.com/package/@google-cloud/cloudbuild)

### Example

#### Build container with the Docker Engine provider

```typescript
import { ContainerBuilder } from "@amplication/container-builder";
import { DockerProvider } from "@amplication/container-builder/dist/docker";
import { Docker } from "dockerode";

const builder = new ContainerBuilder({
  default: "docker",
  providers: {
    docker: new DockerProvider(new Docker()),
  },
});

builder.build({
  tags: ["example"],
  url: "file://example/example.tar",
});
```

#### Build container with the Cloud Build provider

```typescript
import { ContainerBuilder } from "@amplication/container-builder";
import { CloudBuildProvider } from "@amplication/container-builder/dist/cloud-build";

const builder = new ContainerBuilder({
  default: "cloudBuild",
  providers: {
    cloudBuild: new CloudBuildClient(),
    gcpAppsProjectId: GCP_APPS_PROJECT_ID,
  },
});

builder.build({
  tags: ["example"],
  url: "gs://project-id/example.tar",
});
```

#### Using Nest.js

`example.service.ts`:

```typescript
import { ContainerBuilderModule } from "@amplication/container-builder";

@Injectable()
class ExampleService {
  constructor(
    private readonly containerBuilderService: ContainerBuilderService
  );
}
```

`example.module.ts`:

```typescript
import { ContainerBuilderModule } from "@amplication/container-builder/dist/nestjs";
import { DockerModule } from "@amplication/container-builder/dist/docker";
import { CloudBuildModule } from "@amplication/container-builder/dist/cloud-build";
import { CloudBuildClient } from "@google-cloud/cloudbuild";
import { Docker } from "dockerode";

@Module({
  imports: [
    ContainerBuilderModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const projectId = configService.get("PROJECT_ID");
        return {
          default: "docker",
          providers: {
            docker: new DockerProvider(new Docker()),
            "cloud-build": new CloudBuildProvider(
              new CloudBuildClient(),
              projectId
            ),
          },
        };
      },
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
  ],
})
class ExampleModule {}
```
