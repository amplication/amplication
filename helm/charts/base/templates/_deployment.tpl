{{- define "base.deployment.tpl" -}}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: '{{ .Values.name }}'
  labels:
    app: '{{ .Values.name }}'
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      app: '{{ .Values.name }}'
  template:
    metadata:
      {{- with .Values.podAnnotations }}
      annotations:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      labels:
        app: '{{ .Values.name }}'
    spec:
      {{- with .Values.image.imagePullSecrets }}
      imagePullSecrets:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      serviceAccountName: default
      containers:
        - name: '{{ .Values.name }}'
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"
          resources:
            limits:
              cpu: {{ .Values.maxCPU }}
              memory: {{ .Values.minMemory }}
            requests:
              cpu:    {{ .Values.minCPU }}
              memory: {{ .Values.maxMemory }}
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
          {{- if hasKey .Values "securityContext" }}
          securityContext:
          {{- with .Values.securityContext -}}
          {{- toYaml . | nindent 12 }}
          {{- end }}
          {{- end }}
          {{- if  hasKey .Values "service" }}
          ports:
            - containerPort: {{ .Values.service.port.target }}
          {{- end }}
      {{- if hasKey .Values "volume" }}
          volumeMounts:
            - name: {{ .Values.volume.name }}
              mountPath: {{ .Values.volume.path }}
      volumes:
        - name: {{ .Values.volume.name }}
          persistentVolumeClaim:
            claimName: {{ .Values.global.pvc.name }}
      {{- end }}
{{- end -}}
{{- define "base.deployment" -}}
{{- include "base.util.merge" (append . "base.deployment.tpl") -}}
{{- end -}}