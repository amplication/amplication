## Amplication-Charts

[Amplication](https://amplication.com) - Amplication is an open‑source development tool. It helps you develop quality Node.js applications without spending time on repetitive coding tasks.

## Introduction

This chart deploys  on a [Kubernetes](http://kubernetes.io) cluster using the [Helm](https://helm.sh) package manager, by using [helm-library](https://helm.sh/docs/topics/library_charts/) & umbrella-chart.

The charts folder is build from 3 main folders:

- amplication - The Umbrella-chart which contains service-dependencies (lookup charts/amplication/Chart.yaml).
- base - The helm library which contains templates for services usage.
- services - Contains all services charts.

## Prerequisites

- Kubernetes v1.16+
- helm v3+
- docker 

## Clone repo

```console
$ git clone https://github.com/amplication/amplication.git ; cd amplication-charts
```

## Installing the Chart locally

NOTE: 
- Ignore the flags ` --create-namespace --namespace [NAMESPACE]` if you don't want to create a new namespace,
  By default it would deployed on `default` namespace.
- `[RELEASE_NAME]` - The name you choose to call the release.
- `<service-folder-name>` - The name of the service folder you want to deploy.

There are 2 ways to install the chart:
1. Deploy each service individually.
2. By umbrella-chart.

To install the chart for each service individually:

```console
$ helm install [RELEASE_NAME] charts/services/<service-folder-name> --create-namespace --namespace [NAMESPACE] 
```
- To run and use the app succesfully you need all services to be deployed.


To install the chart with all services together by using the umbrella-chart, with the release name `amplication`:

```console
$ helm install amplication charts/amplication --create-namespace --namespace [NAMESPACE]
```

You will see the release deployed successfully, and you can check the resources that have been created by the command:

```console
$ kubectl get all -n [NAMESPACE]
```

The command deploys on the Kubernetes cluster in the default configuration which you can see in values.yaml in each service on `services` folder.


## Installing the Chart for cloud deployment. (Optional)

There is an option to deploy and expose the app by [ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) resource instead of using [service](https://kubernetes.io/docs/concepts/services-networking/service/).

The installation is exactly the same as listed above, but with the addition of a `--set` flag for `app` service.

For `app service` we will change the value `traefik.enabled` as you can see on `charts/services/app/values.yaml` the default is set to false.

lookup [ingress controllers](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/) & [traefik](https://doc.traefik.io/traefik/)

Before we set the desire value we need to deploy traefik-controller into the cluster by helm-chart:

```console
$ helm install traefik charts/services/traefik
```
After the ingress-controller succesfully deployed, we are ready to set the value.

To install the service individually:

```console
$ helm install app charts/services/app --create-namespace --namespace [NAMESPACE] --set traefik.enabled=true
```
To install the umbrella-chart with the override:

```console
$ helm install amplication charts/amplication --create-namespace --namespace [NAMESPACE] --set app.traefik.enabled=true
```

Now we can access the app by the external-ip of the `LoadBalancer` service in the traefik-controller:

```console
$ kubectl get svc
$ open http://<external-ip>
```

## Uninstalling the Chart

To uninstall/delete the umbrella-chart `amplication`:

```console
$ helm delete amplication -n [NAMESPACE]
```
To uninstall/delete the service `[RELEASE_NAME]`:

```console
$ helm delete [RELEASE_NAME] -n [NAMESPACE]
```
NOTE:
- The deletion of the release is NOT deleting the `Persistent-Volumes` in the namespace you worked on, and can cause problems later on, run the command:
- `<pvc-name>` - The name of the `Persistent-Volume-Claim` in charts/services/app/values.yaml
```console
$ kubectl get pvc -n [NAMESPACE]
$ kubectl delete pv/<pvc-name> -n [NAMESPACE]
```
The commands remove all the Kubernetes components associated with the chart and deletes the release and the persistent volumes.

## Optional changes

You can specify each parameter using the `--set key=value[key=value]` argument to helm install, for overriding the default values in `value.yaml`. For example:

For each service individually:

```console
$ helm install [RELEASE_NAME] charts/services/<service-folder-name> --create-namespace --namespace [NAMESPACE] --set service.type=NodePort
```
For umbrella-chart:

```console
$ helm install amplication charts/amplication --create-namespace --namespace [NAMESPACE] --set app.service.type=NodePort
```
Alternatively, a YAML file that specifies the values for the parameters can be provided while installing the chart. For example:

```console
$ helm install [RELEASE_NAME] charts/services/<service-folder-name> --create-namespace --namespace [NAMESPACE] -f charts/services/<service-folder-name>/<different-values-file>.yaml
```

