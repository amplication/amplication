{{- define "base.deployment-autoscaling.tpl" -}}
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: '{{ .Values.name }}'
  labels:
    app: '{{ .Values.name }}'
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: {{ .Values.name }}
  minReplicas: {{ .Values.deployment.autoscaling.minReplicas }}
  maxReplicas: {{ .Values.deployment.autoscaling.maxReplicas }}  
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: {{ .Values.deployment.autoscaling.targetCPUUtilizationPercentage }}
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: {{ .Values.deployment.autoscaling.targetMemoryUtilizationPercentage }}
{{- end -}}
{{- define "base.deployment-autoscaling" -}}
{{- include "base.util.merge" (append . "base.deployment.tpl") -}}
{{- end -}}