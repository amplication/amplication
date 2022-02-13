{{- define "common.labels" -}}
helm.sh/chart: {{ printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Values.amplication.image.tag }}
{{- end -}}

{{- define "traefik.labels" -}}
app.kubernetes.io/name: {{ include "traefik.names.fullname" . }}
{{- end -}}

{{- define "traefik.metrics.labels" -}}
app.kubernetes.io/name: {{ include "traefik.metrics.names.fullname" . }}
{{- end -}}


{{- define "client.labels" -}}
app.kubernetes.io/name: {{ include "client.names.fullname" . }}
{{- end -}}

{{- define "server.labels" -}}
app.kubernetes.io/name: {{ include "server.names.fullname" . }}
{{- end -}}