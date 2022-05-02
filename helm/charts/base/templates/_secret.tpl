{{- define "base.secret.tpl" -}}
apiVersion: v1
kind: Secret
type: Opaque
metadata:
  name: '{{ .Values.name }}'
data: 
  {{- range $key, $val := .Values.secrets }}
  {{ $key }}: {{ $val | b64enc | quote }}
  {{- end}}
{{- end }}
{{- define "base.secret" -}}
{{- include "base.util.merge" (append . "base.secret.tpl") -}}
{{- end -}}
