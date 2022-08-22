{{- define "base.job.tpl" -}}
apiVersion: batch/v1
kind: Job
metadata:
  name: "{{ .Values.name }}-migrate"
spec:
  successfulJobsHistoryLimit: 1  
  failedJobsHistoryLimit: 2
  template:
    metadata:
      name: "{{ .Values.name }}-migrate"
    spec:
      restartPolicy: Never
      containers:
      - name: "{{ .Values.name }}-migrate"
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"
        command: ["/bin/sh"]
        args: ["-c", "npm run migrate:up"]
        env:
        - name: POSTGRESQL_URL
          valueFrom:
            secretKeyRef:
              name: {{ .Values.name }}
              key: POSTGRESQL_URL
              optional: false
{{- end -}}
{{- define "base.job" -}}
{{- include "base.util.merge" (append . "base.job.tpl") -}}
{{- end -}}