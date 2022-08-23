{{- define "base.ingress.tpl" -}}
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: {{ .Values.name }}
  annotations:
    kubernetes.io/ingress.class: nginx
    external-dns.alpha.kubernetes.io/hostname: {{ .Values.ingress.hostname }}
spec:
  rules:
  - host: {{ .Values.ingress.hostname }}  
    http:
      paths:
      - backend:
          serviceName: {{ .Values.name }}
          servicePort: http
        path: {{ .Values.ingress.path }}
        pathType: Prefix
      - backend:
          serviceName: {{ .Values.name }}
          servicePort: https
        path: {{ .Values.ingress.path }}
        pathType: Prefix
  {{- if hasKey .Values.ingress "hostname_production" }}
  - host: {{ .Values.ingress.hostname_production }}  
    http:
      paths:
      - backend:
          serviceName: {{ .Values.name }}
          servicePort: http
        path: {{ .Values.ingress.path }}
        pathType: Prefix
      - backend:
          serviceName: {{ .Values.name }}
          servicePort: https
        path: {{ .Values.ingress.path }}
        pathType: Prefix
  {{- end }}
{{- end }}
{{- define "base.ingress" -}}
{{- include "base.util.merge" (append . "base.ingress.tpl") -}}
{{- end -}}