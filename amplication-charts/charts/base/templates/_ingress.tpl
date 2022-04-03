{{- define "base.ingress.tpl" -}}
apiVersion: traefik.containo.us/v1alpha1
kind: IngressRoute
metadata:
  name: {{ .Values.name }}
  labels:
    app: '{{ .Values.name }}'
spec:
  entryPoints:
    - {{ .Values.traefik.entrypoints.http }}
  routes:
  - match: {{ .Values.traefik.rule }}
    kind: Rule
    services:
    - name: '{{ .Values.name }}'
      port: {{ .Values.service.port.number }}
{{- end }}
{{- define "base.ingress" -}}
{{- include "base.util.merge" (append . "base.ingress.tpl") -}}
{{- end -}}