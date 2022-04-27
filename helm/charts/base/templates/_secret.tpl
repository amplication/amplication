{{- define "base.secret.tpl" -}}
apiVersion: v1
kind: Secret
type: Opaque
metadata:
  name: '{{ .Values.name }}'
data: 
  {{- toYaml .Values.secrets | nindent 2 }}
{{- end }}
{{- define "base.secret" -}}
{{- include "base.util.merge" (append . "base.secret.tpl") -}}
{{- end -}}
