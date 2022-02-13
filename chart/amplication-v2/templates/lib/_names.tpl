{{- define "traefik.names.fullname" -}}
{{ printf "%s-%s" .Release.Name .Values.traefik.name | trunc 63 | trimSuffix "-" }}
{{- end -}}

{{- define "traefik.metrics.names.fullname" -}}
{{ printf "%s-%s" .Release.Name .Values.traefik.metrics.name | trunc 63 | trimSuffix "-" }}
{{- end -}}

{{- define "client.names.fullname" -}}
{{ printf "%s-%s" .Release.Name .Values.client.name | trunc 63 | trimSuffix "-" }}
{{- end -}}

{{- define "server.names.fullname" -}}
{{ printf "%s-%s" .Release.Name .Values.server.name | trunc 63 | trimSuffix "-" }}
{{- end -}}
