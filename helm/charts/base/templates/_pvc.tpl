{{- define "base.pvc.tpl" -}}
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: {{ .Values.global.pvc.name }}
spec:
  accessModes:
    - ReadWriteMany
  storageClassName: {{ .Values.global.pvc.storageName }}
  resources:
    requests:
      storage: {{ .Values.global.pvc.storageRequest }}
{{- end }}
{{- define "base.pvc" -}}
{{- include "base.util.merge" (append . "base.pvc.tpl") -}}
{{- end -}}