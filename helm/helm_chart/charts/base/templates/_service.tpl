{{- define "base.service.tpl" -}}
apiVersion: v1
kind: Service
metadata:
  name: '{{ .Values.name }}'
  {{- if .Values.service.certificatearn }}
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-backend-protocol: tcp
    service.beta.kubernetes.io/aws-load-balancer-ssl-cert: {{ .Values.service.certificatearn }}
    service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "443"
  {{- end }}
  labels:
    app: '{{ .Values.name }}'
spec:
  type: {{ .Values.service.type }}
  ports:
    - name: http
      port: 80
      protocol: {{ .Values.service.protocol }}
      targetPort: {{ .Values.service.port.target }}
    - name: https
      port: 443
      protocol: {{ .Values.service.protocol }}
      targetPort: {{ .Values.service.port.target }}
  selector:
    app: '{{ .Values.name }}'
{{- end }}
{{- define "base.service" -}}
{{- include "base.util.merge" (append . "base.service.tpl") -}}
{{- end -}}