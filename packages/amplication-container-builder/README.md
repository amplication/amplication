# Amplication Container ContainerBuilder

Multi-provider service for building Docker containers.

### Example

```typescript
import { ContainerBuilder } from "amplication-container-builder";
import { DockerProvider } from "amplication-container-builder/docker";
import { Docker } from "dockerode";

const builder = new ContainerBuilder({
  default: "docker",
  providers: {
    docker: new DockerProvider(new Docker()),
  },
});
```

### Nest.js integration

`example.service.ts`:

```typescript
import { ContainerBuilderModule } from "amplication-container-builder";

@Injectable()
class ExampleService {
  constructor(
    private readonly containerBuilderService: ContainerBuilderService
  );
}
```

`example.module.ts`:

```typescript
import { ContainerBuilderModule } from "amplication-container-builder/dist/nestjs";
import { DockerModule } from "amplication-container-builder/dist/docker";
import { CloudBuildModule } from "amplication-container-builder/dist/cloud-build";
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
