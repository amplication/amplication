import json
import os
from pathlib import Path

root_folder=os.getenv('GITHUB_WORKSPACE',Path(__file__).parents[3])
output_folder=os.getenv('OUTPUT_FOLDER',os.path.join(root_folder,'secrets'))
secrets_file=os.getenv('SECRETS_FILE_PATH',os.path.join("/Users/iliagerman/Work/Sela/Clients/amplication/amplication/helm/charts/amplication/values-secrets-staging-os.json"))
secrets_template=os.getenv('SECRETS_TEMPLATE_FILE_PATH',os.path.join("/Users/iliagerman/Work/Sela/Clients/amplication/amplication/.github/workflows/scripts/secret_template.yaml"))

print(f"root_folder: {root_folder}")
print(f"output_folder: {output_folder}")
print(f"secrets_template: {secrets_template}")

Path(output_folder).mkdir(parents=True, exist_ok=True)
secrets = json.load(open(secrets_file))
for secret in secrets:
    secret_name=secret["name"]
    secret_template = json.load(open(secrets_template))
    secret_template["metadata"]["name"]=secret_name
    for secret_entry in secret["data"]:
        secret_template["data"][secret_entry]=secret["data"][secret_entry]
    output_file=os.path.join(output_folder,f"{secret_name}-secret.json")
    with open(output_file, 'w') as outfile:
        json.dump(secret_template, outfile)
