# Plan: Move DSGResourceData from Kafka to Shared Storage

## Problem
DSGResourceData in Kafka messages exceeds 1MB Azure Event Hubs limit for large resources.

## Solution Overview
Move DSGResourceData from Kafka message payload to shared file storage, sending only lightweight message with metadata.

---

## Configuration Changes

### Server Configuration
**File:** `az-production/applications/server/values.yaml`

Add new environment variables:
```yaml
configmap:
  # ... existing config ...
  # New variables for DSGResourceData file storage
  DSG_RESOURCE_DATA_BASE_FOLDER: "/amplication-data/dsg-resource-data"
  DSG_RESOURCE_DATA_FILE: "resource-data.json"
```

**No volume changes needed** - server already has `/amplication-data` mount.

### Build Manager Configuration  
**File:** `az-production/applications/build-manager/values.yaml`

Add new environment variable:
```yaml
configmap:
  # ... existing config ...
  # New variable to read DSGResourceData from shared storage
  DSG_RESOURCE_DATA_BASE_FOLDER: "/build-artifacts/dsg-resource-data"
  DSG_RESOURCE_DATA_FILE: "resource-data.json"
```

**No volume changes needed** - build-manager already has `/build-artifacts` mount which points to same Azure File Share.

---

## Code Changes

### 1. Server Changes

**File:** `packages/amplication-server/src/env.ts`
```typescript
export class Env {
  // ... existing variables ...
  static readonly DSG_RESOURCE_DATA_BASE_FOLDER = "DSG_RESOURCE_DATA_BASE_FOLDER";
  static readonly DSG_RESOURCE_DATA_FILE = "DSG_RESOURCE_DATA_FILE";
}
```

**File:** `packages/amplication-server/src/core/build/build.service.ts`

Add new method:
```typescript
async saveDsgResourceDataToSharedStorage(
  buildId: string,
  dsgResourceData: CodeGenTypes.DSGResourceData
): Promise<void> {
  const savePath = join(
    this.configService.get("DSG_RESOURCE_DATA_BASE_FOLDER") || "/amplication-data/dsg-resource-data",
    buildId,
    this.configService.get("DSG_RESOURCE_DATA_FILE") || "resource-data.json"
  );

  const saveDir = dirname(savePath);
  await fs.mkdir(saveDir, { recursive: true });

  await fs.writeFile(
    savePath,
    JSON.stringify(dsgResourceData)
  );
}
```

Modify `generate()` method:
```typescript
private async generate(
  logger: ILogger,
  build: Build,
  user: User
): Promise<string> {
  return this.actionService.run(
    build.actionId,
    GENERATE_STEP_NAME,
    GENERATE_STEP_MESSAGE,
    async (step) => {
      const { resourceId, id: buildId, version: buildVersion } = build;

      const resource = await this.resourceService.resource({
        where: { id: resourceId },
      });

      const dsgResourceData = await this.getDSGResourceData(
        resource,
        buildId,
        buildVersion,
        user
      );

      // Save DSGResourceData to shared storage instead of sending in message
      logger.info("Saving DSG resource data to shared storage");
      await this.saveDsgResourceDataToSharedStorage(buildId, dsgResourceData);

      logger.info("Writing lightweight build generation message to queue");

      // Send message WITHOUT dsgResourceData
      const codeGenerationEvent: CodeGenerationRequest.KafkaEvent = {
        key: null,
        value: {
          resourceId,
          buildId,
          // REMOVED: dsgResourceData
        },
      };

      await this.kafkaProducerService.emitMessage(
        KAFKA_TOPICS.CODE_GENERATION_REQUEST_TOPIC,
        codeGenerationEvent
      );

      return null;
    },
    true
  );
}
```

### 2. Build Manager Changes

**File:** `packages/amplication-build-manager/src/env.ts`
```typescript
export class Env {
  // ... existing variables ...
  static readonly DSG_RESOURCE_DATA_BASE_FOLDER = "DSG_RESOURCE_DATA_BASE_FOLDER";
  static readonly DSG_RESOURCE_DATA_FILE = "DSG_RESOURCE_DATA_FILE";
}
```

**File:** `packages/amplication-build-manager/src/build-runner/build-runner.service.ts`

Add new method:
```typescript
async readDsgResourceDataFromSharedStorage(buildId: string): Promise<DSGResourceData> {
  const filePath = join(
    this.configService.get("DSG_RESOURCE_DATA_BASE_FOLDER") || "/build-artifacts/dsg-resource-data",
    buildId,
    this.configService.get("DSG_RESOURCE_DATA_FILE") || "resource-data.json"
  );

  const data = await fs.readFile(filePath);
  return JSON.parse(data.toString()) as DSGResourceData;
}
```

Modify `runBuild()` method:
```typescript
async runBuild(
  resourceId: string,
  buildId: string
  // REMOVED: dsgResourceData: DSGResourceData parameter
) {
  // Read DSGResourceData from shared storage instead of parameter
  const dsgResourceData = await this.readDsgResourceDataFromSharedStorage(buildId);
  
  let codeGeneratorVersion: string;
  const codeGeneratorFullName =
    await this.codeGeneratorNameToContainerImageName(
      dsgResourceData.resourceInfo.codeGeneratorName
    );
  
  // Rest of method continues normally with dsgResourceData...
}
```

**File:** `packages/amplication-build-manager/src/build-runner/build-runner.controller.ts`

Modify controller method:
```typescript
@EventPattern(KAFKA_TOPICS.CODE_GENERATION_REQUEST_TOPIC)
async onCodeGenerationRequest(
  @Payload() message: CodeGenerationRequest.Value
): Promise<void> {
  this.logger.info("Code generation request received", {
    buildId: message.buildId,
    resourceId: message.resourceId,
  });

  await this.buildRunnerService.runBuild(
    message.resourceId,
    message.buildId
    // REMOVED: message.dsgResourceData parameter
  );
}
```

### 3. Schema Registry Changes

**File:** `@amplication/schema-registry` (CodeGenerationRequest)
```typescript
export namespace CodeGenerationRequest {
  export interface Value {
    resourceId: string;
    buildId: string;
    // REMOVED: dsgResourceData: DSGResourceData;
  }
}
```

---

## File Structure

**Shared storage will contain:**
```
Azure File Share: a-production-main-files
├── dsg-resource-data/           # NEW: DSGResourceData files
│   ├── {buildId-1}/
│   │   └── resource-data.json   # DSGResourceData for build 1
│   ├── {buildId-2}/
│   │   └── resource-data.json   # DSGResourceData for build 2
│   └── ...
├── dsg-jobs/                    # EXISTING: Build-manager's DSG processing
│   ├── {buildId-1}/
│   │   ├── input.json           # Build-manager saves here (different purpose)
│   │   └── code/
│   └── ...
└── build-data/                  # EXISTING: Generated code artifacts
    └── ...
```

---

## Key Points

1. **No volume mount changes** - both services use existing mounts to same Azure File Share
2. **Two separate purposes:**
   - `/dsg-resource-data/` - Server saves DSGResourceData for build-manager to read
   - `/dsg-jobs/` - Build-manager's internal DSG processing (unchanged)
3. **Lightweight Kafka messages** - only metadata, no large payloads
4. **Same underlying storage** - `/amplication-data` and `/build-artifacts` point to same Azure File Share

---

## Implementation Steps

1. **Update Schema Registry** - Remove dsgResourceData from CodeGenerationRequest interface
2. **Update Server** - Add env vars, implement file saving, modify generate() method
3. **Update Build Manager** - Add env vars, implement file reading, modify runBuild() method
4. **Deploy Configuration** - Update values.yaml files for both services
5. **Test** - Verify large resources no longer cause 1MB limit issues

---

## Rollback Plan

If issues arise, revert by:
1. Restore original CodeGenerationRequest interface with dsgResourceData
2. Revert server generate() method to send data in Kafka message
3. Revert build-manager runBuild() to accept dsgResourceData parameter
4. Remove new environment variables from configuration
