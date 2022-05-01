{{- define "base.configmap.tpl" -}}
apiVersion: v1
kind: ConfigMap
metadata:
  name: '{{ .Values.name }}'
data: 
  {{- toYaml .Values.config.env | nindent 2 }}
{{- end }}
{{- define "base.configmap" -}}
{{- include "base.util.merge" (append . "base.configmap.tpl") -}}
{{- end -}}