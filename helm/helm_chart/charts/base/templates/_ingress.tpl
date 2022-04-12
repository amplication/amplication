{{- define "base.ingress.tpl" -}}
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: {{ .Values.name }}
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/rewrite-target: /$1
spec:
  rules:
  - host: {{ .Values.ingress.hostname }}  
    http:
      paths:
      - backend:
          serviceName: {{ .Values.name }}
          servicePort: http
        path: /
      - backend:
          serviceName: {{ .Values.name }}
          servicePort: https
        path: /
{{- end }}
{{- define "base.ingress" -}}
{{- include "base.util.merge" (append . "base.ingress.tpl") -}}
{{- end -}}