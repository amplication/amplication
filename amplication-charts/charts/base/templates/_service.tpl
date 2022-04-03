{{- define "base.service.tpl" -}}
apiVersion: v1
kind: Service
metadata:
  name: '{{ .Values.name }}'
  labels:
    app: '{{ .Values.name }}'
spec:
  type: {{ .Values.service.type }}
  ports:
    - name: {{ .Values.service.port.name }}
      port: {{ .Values.service.port.number }}
      protocol: {{ .Values.service.protocol }}
  selector:
    app: '{{ .Values.name }}'
{{- end }}
{{- define "base.service" -}}
{{- include "base.util.merge" (append . "base.service.tpl") -}}
{{- end -}}