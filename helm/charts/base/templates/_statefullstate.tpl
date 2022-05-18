{{- define "base.statefulset.tpl" -}}
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: '{{ .Values.name }}'
  labels:
    app: '{{ .Values.name }}'
spec:
  selector:
    matchLabels:
      app: {{ .Values.name }} # has to match .spec.template.metadata.labels
  serviceName: "{{ .Values.name }}"
  replicas: {{ .Values.statefulset.replicaCount }}
  selector:
    matchLabels:
      app: '{{ .Values.name }}'
  template:
    metadata:
      {{- with .Values.statefulset.podAnnotations }}
      annotations:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      labels:
        app: '{{ .Values.name }}'
    spec:
      {{- with .Values.statefulset.image.imagePullSecrets }}
      imagePullSecrets:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      serviceAccountName: default
      containers:
        - name: '{{ .Values.name }}'
          lifecycle:
            postStart:
              exec:
                command:
                  - /bin/sh
                  - -c
                  - echo "$GCP" >> /var/gcp-secret
          imagePullPolicy: {{ .Values.statefulset.image.pullPolicy }}
          image: "{{ .Values.statefulset.image.repository }}:{{ .Values.statefulset.image.tag | default .Chart.AppVersion }}"
          {{- if hasKey .Values "config" }}
          envFrom:
          - configMapRef:
              name: '{{ .Values.name }}'
          - secretRef:
              name: '{{ .Values.name }}'
          {{- end }}
          env: 
            - name: ENVIRONMENT
              valueFrom:
                fieldRef:
                  fieldPath: metadata.namespace
          {{- if hasKey .Values.statefulset "securityContext" }}
          securityContext:
          {{- with .Values.statefulset.securityContext -}}
          {{- toYaml . | nindent 12 }}
          {{- end }}
          {{- end }}
          resources:
            {{- toYaml .Values.statefulset.resources | nindent 12 }}
          {{- if  hasKey .Values "service" }}
          ports:
            - containerPort: {{ .Values.service.port.target }}
          {{- end }}
      {{- if hasKey .Values.statefulset "volume" }}
          volumeMounts:
            - name: {{ .Values.statefulset.volume.name }}
              mountPath: {{ .Values.statefulset.volume.path }}
      volumes:
        - name: {{ .Values.statefulset.volume.name }}
          persistentVolumeClaim:
            claimName: {{ .Values.statefulset.volume.name }}
      {{- end }}
{{- end -}}
{{- define "base.statefulset" -}}
{{- include "base.util.merge" (append . "base.statefulset.tpl") -}}
{{- end -}}