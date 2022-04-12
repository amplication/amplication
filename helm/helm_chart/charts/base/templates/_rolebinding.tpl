{{- define "base.rolebinding.tpl" -}}
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: 'migration-{{ .Values.name }}'
  namespace: {{ .Release.Namespace }}
subjects:
- kind: ServiceAccount
  name: default
  namespace: {{ .Release.Namespace }}
roleRef:
  kind: Role
  name: 'migration-{{ .Values.name }}'
  apiGroup: rbac.authorization.k8s.io
{{- end }}
{{- define "base.rolebinding" -}}
{{- include "base.util.merge" (append . "base.rolebinding.tpl") -}}
{{- end -}}
