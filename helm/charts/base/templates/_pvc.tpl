{{- define "base.pvc.tpl" -}}
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: {{ .Values.volume.name }}
spec:
  accessModes:
    - ReadWriteMany
  storageClassName: {{ .Values.pvc.storageName }}
  resources:
    requests:
      storage: {{ .Values.pvc.storageRequest }}
{{- end }}
{{- define "base.pvc" -}}
{{- include "base.util.merge" (append . "base.pvc.tpl") -}}
{{- end -}}