# 

[Amplication](https://amplication.com) - Amplication is an open‑source development tool. It helps you develop quality Node.js applications without spending time on repetitive coding tasks.


## Introduction

This chart deploys  on a [Kubernetes](http://kubernetes.io) cluster using the [Helm](https://helm.sh) package manager.

## Prerequisites

- Kubernetes v1.16+

## Installing the Chart

To install the chart with the release name `amplication`:

```console
$ git clone https://github.com/amplication/amplication.git ; cd amplication
$ helm install amplication chart/amplication --create-namespace --namespace amplication
```

The command deploys  on the Kubernetes cluster in the default configuration. The [configuration](#configuration) section lists the parameters that can be configured during installation.

## Uninstalling the Chart

To uninstall/delete the `amplication`:

```console
$ helm delete amplication --namespace amplication
```

The command removes all the Kubernetes components associated with the chart and deletes the release.

## Configuration

The following table lists the configurable parameters of the `amplication` chart and their default values.

|                                Parameter                                |                                                                    Description                                                                    |          Default          |
|-------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
| imagePullSecrets                                                        |                                                                                                                                                   | `[]`                      |
| nameOverride                                                            |                                                                                                                                                   | `""`                      |
| fullnameOverride                                                        |                                                                                                                                                   | `""`                      |
| scheduler.name                                                          |                                                                                                                                                   | `scheduler`               |
| scheduler.replicaCount                                                  |                                                                                                                                                   | `1`                       |
| scheduler.autoscaling.enabled                                           |                                                                                                                                                   | `false`                   |
| scheduler.autoscaling.minReplicas                                       |                                                                                                                                                   | `1`                       |
| scheduler.autoscaling.maxReplicas                                       |                                                                                                                                                   | `100`                     |
| scheduler.autoscaling.targetCPUUtilizationPercentage                    |                                                                                                                                                   | `80`                      |
| scheduler.autoscaling.targetMemoryUtilizationPercentage                 |                                                                                                                                                   | `80`                      |
| scheduler.podAnnotations                                                |                                                                                                                                                   | `{}`                      |
| scheduler.image.pullPolicy                                              |                                                                                                                                                   | `Always`                  |
| scheduler.image.repository                                              |                                                                                                                                                   | `amplication/scheduler`   |
| scheduler.image.tag                                                     | Overrides the image tag whose default is the chart appVersion.                                                                                    | `latest`                  |
| scheduler.resources                                                     |                                                                                                                                                   | `{}`                      |
| scheduler.config.env.POSTGRESQL_URL                                     |                                                                                                                                                   | ``                        |
| containerbuilder.docker.name                                            |                                                                                                                                                   | `docker`                  |
| containerbuilder.docker.replicaCount                                    |                                                                                                                                                   | `1`                       |
| containerbuilder.docker.autoscaling.enabled                             |                                                                                                                                                   | `false`                   |
| containerbuilder.docker.autoscaling.minReplicas                         |                                                                                                                                                   | `1`                       |
| containerbuilder.docker.autoscaling.maxReplicas                         |                                                                                                                                                   | `100`                     |
| containerbuilder.docker.autoscaling.targetCPUUtilizationPercentage      |                                                                                                                                                   | `80`                      |
| containerbuilder.docker.autoscaling.targetMemoryUtilizationPercentage   |                                                                                                                                                   | `80`                      |
| containerbuilder.docker.podAnnotations                                  |                                                                                                                                                   | `{}`                      |
| containerbuilder.docker.image.pullPolicy                                |                                                                                                                                                   | `Always`                  |
| containerbuilder.docker.image.repository                                |                                                                                                                                                   | `docker`                  |
| containerbuilder.docker.image.tag                                       |                                                                                                                                                   | `dind`                    |
| containerbuilder.docker.service.type                                    |                                                                                                                                                   | `ClusterIP`               |
| containerbuilder.docker.service.port                                    |                                                                                                                                                   | `2375`                    |
| containerbuilder.docker.resources                                       |                                                                                                                                                   | `{}`                      |
| containerbuilder.registry.name                                          |                                                                                                                                                   | `registry`                |
| containerbuilder.registry.replicaCount                                  |                                                                                                                                                   | `1`                       |
| containerbuilder.registry.volume.name                                   |                                                                                                                                                   | `registry-data`           |
| containerbuilder.registry.volume.path                                   |                                                                                                                                                   | `/var/lib/registry`       |
| containerbuilder.registry.volume.storageLimit                           |                                                                                                                                                   | `20Gi`                    |
| containerbuilder.registry.volume.storageRequest                         |                                                                                                                                                   | `2Gi`                     |
| containerbuilder.registry.autoscaling.enabled                           |                                                                                                                                                   | `false`                   |
| containerbuilder.registry.autoscaling.minReplicas                       |                                                                                                                                                   | `1`                       |
| containerbuilder.registry.autoscaling.maxReplicas                       |                                                                                                                                                   | `100`                     |
| containerbuilder.registry.autoscaling.targetCPUUtilizationPercentage    |                                                                                                                                                   | `80`                      |
| containerbuilder.registry.autoscaling.targetMemoryUtilizationPercentage |                                                                                                                                                   | `80`                      |
| containerbuilder.registry.podAnnotations                                |                                                                                                                                                   | `{}`                      |
| containerbuilder.registry.image.pullPolicy                              |                                                                                                                                                   | `Always`                  |
| containerbuilder.registry.image.repository                              |                                                                                                                                                   | `registry`                |
| containerbuilder.registry.image.tag                                     |                                                                                                                                                   | `2`                       |
| containerbuilder.registry.service.type                                  |                                                                                                                                                   | `ClusterIP`               |
| containerbuilder.registry.service.port                                  |                                                                                                                                                   | `5000`                    |
| containerbuilder.registry.resources                                     |                                                                                                                                                   | `{}`                      |
| app.name                                                                |                                                                                                                                                   | `app`                     |
| app.replicaCount                                                        |                                                                                                                                                   | `1`                       |
| app.volume.name                                                         |                                                                                                                                                   | `app-artifacts-data`      |
| app.volume.path                                                         |                                                                                                                                                   | `/artifacts`              |
| app.volume.storageLimit                                                 |                                                                                                                                                   | `5Gi`                     |
| app.volume.storageRequest                                               |                                                                                                                                                   | `1Gi`                     |
| app.autoscaling.enabled                                                 |                                                                                                                                                   | `false`                   |
| app.autoscaling.minReplicas                                             |                                                                                                                                                   | `1`                       |
| app.autoscaling.maxReplicas                                             |                                                                                                                                                   | `100`                     |
| app.autoscaling.targetCPUUtilizationPercentage                          |                                                                                                                                                   | `80`                      |
| app.autoscaling.targetMemoryUtilizationPercentage                       |                                                                                                                                                   | `80`                      |
| app.podAnnotations                                                      |                                                                                                                                                   | `{}`                      |
| app.image.pullPolicy                                                    |                                                                                                                                                   | `Always`                  |
| app.image.repository                                                    |                                                                                                                                                   | `amplication/amplication` |
| app.image.tag                                                           | Overrides the image tag whose default is the chart appVersion.                                                                                    | `latest`                  |
| app.service.type                                                        |                                                                                                                                                   | `ClusterIP`               |
| app.service.port                                                        |                                                                                                                                                   | `3000`                    |
| app.resources                                                           |                                                                                                                                                   | `{}`                      |
| app.config.env.POSTGRESQL_URL                                           |                                                                                                                                                   | ``                        |
| app.config.env.JWT_SECRET                                               |                                                                                                                                                   | `jwt-secret`              |
| app.config.env.SERVICE_JWT_SECRET                                       |                                                                                                                                                   | `service-jwt-secret`      |
| app.config.env.BCRYPT_SALT_OR_ROUNDS                                    |                                                                                                                                                   | `"10"`                    |
| app.config.env.NODE_ENV                                                 |                                                                                                                                                   | `production`              |
| app.config.env.CORS_ENABLE                                              |                                                                                                                                                   | `"1"`                     |
| app.config.env.PORT                                                     |                                                                                                                                                   | ``                        |
| app.config.env.HOST                                                     |                                                                                                                                                   | ``                        |
| app.config.env.DEFAULT_DISK                                             |                                                                                                                                                   | `local`                   |
| app.config.env.LOCAL_DISK_ROOT                                          |                                                                                                                                                   | `/artifacts`              |
| app.config.env.CONTAINER_BUILDER_DEFAULT                                |                                                                                                                                                   | `docker`                  |
| postgres.install                                                        | Setting "install" to true will install third-party helm chart (bitnami/postgres) https://github.com/bitnami/charts/tree/master/bitnami/postgresql | `true`                    |
| postgres.postgresqlDatabase                                             |                                                                                                                                                   | `postgres`                |
| postgres.postgresqlUsername                                             |                                                                                                                                                   | `postgres`                |
| postgres.postgresqlPassword                                             |                                                                                                                                                   | `Fd7zZXWvCY3bdgLHz`       |
| postgres.servicePort                                                    |                                                                                                                                                   | `5432`                    |
| postgres.primary.podLabels.name                                         |                                                                                                                                                   | `"localpostgres"`         |
| postgres.fullnameOverride                                               |                                                                                                                                                   | `"localpostgres"`         |


Specify each parameter using the `--set key=value[,key=value]` argument to `helm install`. For example:

```console
$ helm install amplication chart/amplication --namespace amplication --set scheduler.name=scheduler
```

Alternatively, a YAML file that specifies the values for the parameters can be provided while
installing the chart. For example:

```console
$ helm install amplication chart/amplication --namespace amplication --values values.yaml
```
