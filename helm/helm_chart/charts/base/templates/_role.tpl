{{- define "base.role.tpl" -}}
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: 'migration-{{ .Values.name }}'
rules:
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["get","watch","list"]
{{- end }}
{{- define "base.role" -}}
{{- include "base.util.merge" (append . "base.role.tpl") -}}
{{- end -}}
