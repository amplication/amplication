{{- define "base.deployment.tpl" -}}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: '{{ .Values.name }}'
  labels:
    app: '{{ .Values.name }}'
spec:
  {{- if not .Values.deployment.autoscaling.enabled }}
  replicas: {{ .Values.deployment.replicaCount }}
  {{- end }}
  selector:
    matchLabels:
      app: '{{ .Values.name }}'
  template:
    metadata:
      {{- with .Values.deployment.podAnnotations }}
      annotations:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      labels:
        app: '{{ .Values.name }}'
    spec:
      {{- with .Values.deployment.image.imagePullSecrets }}
      imagePullSecrets:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      serviceAccountName: default
      containers:
        - name: '{{ .Values.name }}'
          imagePullPolicy: {{ .Values.deployment.image.pullPolicy }}
          image: "{{ .Values.deployment.image.repository }}:{{ .Values.deployment.image.tag | default .Chart.AppVersion }}"
          {{- if hasKey .Values "config" }}
          envFrom:
          - configMapRef:
              name: '{{ .Values.name }}'
          {{- end }}
          env: 
            - name: ENVIRONMENT
              valueFrom:
                fieldRef:
                  fieldPath: metadata.namespace
          {{- if hasKey .Values.deployment "securityContext" }}
          securityContext:
          {{- with .Values.deployment.securityContext -}}
          {{- toYaml . | nindent 12 }}
          {{- end }}
          {{- end }}
          resources:
            {{- toYaml .Values.deployment.resources | nindent 12 }}
          {{- if  hasKey .Values "service" }}
          ports:
            - containerPort: {{ .Values.service.port.target }}
          {{- end }}
      {{- if hasKey .Values.deployment "volume" }}
          volumeMounts:
            - name: {{ .Values.deployment.volume.name }}
              mountPath: {{ .Values.deployment.volume.path }}
      volumes:
        - name: {{ .Values.deployment.volume.name }}
          persistentVolumeClaim:
            claimName: {{ .Values.deployment.volume.name }}
      {{- end }}
{{- end -}}
{{- define "base.deployment" -}}
{{- include "base.util.merge" (append . "base.deployment.tpl") -}}
{{- end -}}