# Amplication Container Builder

Multi-provider service for building Docker containers.

### Example

```typescript
import { Builder } from "amplication-container-builder";
import { DockerProvider } from "amplication-container-builder/docker";
import { Docker } from "dockerode";

const builder = new Builder({
  default: "docker",
  builders: {
    docker: new DockerProvider(new Docker()),
  },
});
```
