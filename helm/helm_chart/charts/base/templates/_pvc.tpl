{{- define "base.pvc.tpl" -}}
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: {{ .Values.deployment.volume.name }}
spec:
  volumeMode: Filesystem
  accessModes:
    - ReadWriteOnce
  resources:
    limits:
      storage: {{ .Values.pvc.storageLimit }}
    requests:
      storage: {{ .Values.pvc.storageRequest }}
{{- end }}
{{- define "base.pvc" -}}
{{- include "base.util.merge" (append . "base.pvc.tpl") -}}
{{- end -}}