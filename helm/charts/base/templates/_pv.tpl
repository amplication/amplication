{{- define "base.pv.tpl" -}}
apiVersion: v1
kind: PersistentVolume
metadata:
  name: {{ .Values.global.pv.name }}
spec:
  capacity:
    storage: 5Gi
  volumeMode: Filesystem
  accessModes:
    - ReadWriteMany
  storageClassName: efs-sc
  persistentVolumeReclaimPolicy: Retain
  csi:
    driver: efs.csi.aws.com
    volumeHandle: {{ .Values.global.pv.handle }}
{{- end }}
{{- define "base.pv" -}}
{{- include "base.util.merge" (append . "base.pv.tpl") -}}
{{- end -}}