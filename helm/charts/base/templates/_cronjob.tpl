{{- define "base.cronjob.tpl" -}}
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: "{{ .Values.name }}-migrate-cronjob"
spec:
  successfulJobsHistoryLimit: 1  
  failedJobsHistoryLimit: 2
  concurrencyPolicy: Forbid
  schedule: "* * * * *"
  jobTemplate:
    spec:
      template:
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
{{- define "base.cronjob" -}}
{{- include "base.util.merge" (append . "base.cronjob.tpl") -}}
{{- end -}}