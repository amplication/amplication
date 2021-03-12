# #################
# #### GLOBALS ####
###################

{{/*
Expand the name of the chart.
*/}}
{{- define "amplication.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "amplication.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "amplication.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}


{{/* 
K8s-wait-for init container functions 
*/}}

# Waiting for the postgres connection to become available 
{{- define "waitfor.postgres.connection" }}
  # If postgres server is installed within cluster we'll wait for pods to be ready.
  {{ if eq .Values.postgres.install true  }}
- name: wait-for-postgres-connection
  image: groundnuty/k8s-wait-for:v1.3
  imagePullPolicy: Always
  args:
    - "pod"
    - "{{ .Values.postgres.fullnameOverride }}-0"
  {{ end }}
{{- end }}


# #########################
# #### Amplication App ####
###########################

{{/*
Expand the name of the Amplication app service.
*/}}
{{- define "amplication.app.name" -}}
{{ include "amplication.fullname" . }}-{{ .Values.app.name }}
{{- end }}

{{/*
Amplication App Common labels
*/}}
{{- define "amplication.app.labels" -}}
helm.sh/chart: {{ include "amplication.chart" . }}
{{ include "amplication.app.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Amplication App Selector labels
*/}}
{{- define "amplication.app.selectorLabels" -}}
app.kubernetes.io/name: {{ include "amplication.app.name" . }}
{{- end }}


# #########################
# #### Amplication Scheduler ####
###########################

{{/*
Expand the name of the Amplication app service.
*/}}
{{- define "amplication.scheduler.name" -}}
{{ include "amplication.fullname" . }}-{{ .Values.scheduler.name }}
{{- end }}

{{/*
Amplication App Common labels
*/}}
{{- define "amplication.scheduler.labels" -}}
helm.sh/chart: {{ include "amplication.chart" . }}
{{ include "amplication.scheduler.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Amplication App Selector labels
*/}}
{{- define "amplication.scheduler.selectorLabels" -}}
app.kubernetes.io/name: {{ include "amplication.scheduler.name" . }}
{{- end }}


# ##############################################
# #### Amplication Docker Container Builder ####
################################################

{{/*
Expand the name of the Docker service.
*/}}
{{- define "amplication.containerbuilder.docker.name" -}}
{{ include "amplication.fullname" . }}-{{ .Values.containerbuilder.docker.name }}
{{- end }}

{{/*
Docker Common labels
*/}}
{{- define "amplication.containerbuilder.docker.labels" -}}
helm.sh/chart: {{ include "amplication.chart" . }}
{{ include "amplication.containerbuilder.docker.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Docker Selector labels
*/}}
{{- define "amplication.containerbuilder.docker.selectorLabels" -}}
app.kubernetes.io/name: {{ include "amplication.containerbuilder.docker.name" . }}
{{- end }}


# ###############################################
# #### Amplication Docker Container Registry ####
#################################################

{{/*
Expand the name of the docker registry service.
*/}}
{{- define "amplication.containerbuilder.registry.name" -}}
{{ include "amplication.fullname" . }}-{{ .Values.containerbuilder.registry.name }}
{{- end }}

{{/*
Registry Common labels
*/}}
{{- define "amplication.containerbuilder.registry.labels" -}}
helm.sh/chart: {{ include "amplication.chart" . }}
{{ include "amplication.containerbuilder.registry.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Registry Selector labels
*/}}
{{- define "amplication.containerbuilder.registry.selectorLabels" -}}
app.kubernetes.io/name: {{ include "amplication.containerbuilder.registry.name" . }}
{{- end }}
