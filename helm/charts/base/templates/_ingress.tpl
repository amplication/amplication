{{- define "base.ingress.tpl" -}}
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: {{ .Values.name }}
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: {{ .Values.ingress.hostname }}  
    http:
      paths:
      - backend:
          serviceName: amplication-server
          servicePort: http
        path: /
      - backend:
          serviceName: amplication-server
          servicePort: https
        path: /
      - backend:
          serviceName: {{ .Values.name }}
          servicePort: http
        path: {{ .Values.ingress.path }}
      - backend:
          serviceName: {{ .Values.name }}
          servicePort: https
        path: {{ .Values.ingress.path }}
  {{- if hasKey .Values.ingress "hostname_production" }}
  - host: {{ .Values.ingress.hostname_production }}  
    http:
      paths:
      - backend:
          serviceName: amplication-server
          servicePort: http
        path: /
      - backend:
          serviceName: amplication-server
          servicePort: https
        path: /
      - backend:
          serviceName: {{ .Values.name }}
          servicePort: http
        path: {{ .Values.ingress.path }}
      - backend:
          serviceName: {{ .Values.name }}
          servicePort: https
        path: {{ .Values.ingress.path }}
  {{- end }}
{{- end }}
{{- define "base.ingress" -}}
{{- include "base.util.merge" (append . "base.ingress.tpl") -}}
{{- end -}}