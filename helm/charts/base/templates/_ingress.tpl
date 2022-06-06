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
          serviceName: amplication-git-push-webhook-service
          servicePort: http
        path: /webhook
      - backend:
          serviceName: amplication-git-push-webhook-service
          servicePort: https
        path: /webhook

      - backend:
          serviceName: amplication-git-pull-service
          servicePort: http
        path: /pull
      - backend:
          serviceName: amplication-git-pull-service
          servicePort: https
        path: /pull

      - backend:
          serviceName: amplication-git-pull-request-service
          servicePort: http
        path: /pull-request
      - backend:
          serviceName: amplication-git-pull-request-service
          servicePort: https
        path: /pull-request

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
          serviceName: amplication-git-push-webhook-service
          servicePort: http
        path: /webhook
      - backend:
          serviceName: amplication-git-push-webhook-service
          servicePort: https
        path: /webhook

      - backend:
          serviceName: amplication-git-pull-service
          servicePort: http
        path: /pull
      - backend:
          serviceName: amplication-git-pull-service
          servicePort: https
        path: /pull

      - backend:
          serviceName: amplication-git-pull-request-service
          servicePort: http
        path: /pull-request
      - backend:
          serviceName: amplication-git-pull-request-service
          servicePort: https
        path: /pull-request
  {{- end }}
{{- end }}
{{- define "base.ingress" -}}
{{- include "base.util.merge" (append . "base.ingress.tpl") -}}
{{- end -}}