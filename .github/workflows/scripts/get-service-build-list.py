import os
import json
from pathlib import Path
from typing import List
root_folder=os.getenv('GITHUB_WORKSPACE',Path(__file__).parents[3])
services_output_file=os.getenv('SERVICES_OUPTUT_PATH',os.path.join(root_folder,'service_build_list.json'))
packages_output_file=os.getenv('PACKAGES_OUPTUT_PATH',os.path.join(root_folder,'package_build_list.json'))
helm_services_folder=os.getenv('HELM_SERVICES_FOLDER',os.path.join(root_folder,'helm/charts/services'))
packages_folder=os.getenv('PACKAGES_FOLDER',os.path.join(root_folder,'packages'))
changed_folders=[]
#changed_folders=["amplication-cli", "amplication-client", "amplication-container-builder", "amplication-data", "amplication-data-service-generator", "amplication-deployer", "amplication-design-system", "amplication-scheduler", "amplication-server"]
changed_files=os.getenv('CHANGED_FILES_PR') or os.getenv('CHANGED_FILES_NOT_PR')

print(f"root_folder: {root_folder}")
print(f"services_output_file: {services_output_file}")
print(f"packages_output_file: {packages_output_file}")
print(f"helm_services_folder: {helm_services_folder}")
print(f"packages_folder: {packages_folder}")
print(f"changed_files: {changed_files}")

def is_service(service_list,service_name) -> bool:
  return service_name in service_list

def dependet_services(package_name) -> List[str]:
    services=[]
    npm_package_name=package_name.replace("-","/",1)
    for service in all_services:
        package_json=f"{packages_folder}/{service}/package.json"
        with open(package_json, 'r') as file:
            depencies = file.read().replace('\n', '')
        if f"\"@{npm_package_name}\":" in depencies:
            print(f"The service {service} depends on package {npm_package_name}, will build")
            services.append(service)
    return services

def get_changed_folders():
    if not changed_files:
        print('no changed files')
    else:
        for changed_file in changed_files.split(','):
            changed_folders.append(changed_file.split('/')[1])
    print(f"changed_folders: {changed_folders}")
    return changed_folders

def get_package_name(raw_package) -> str:
    fixed_package = f"@{raw_package.replace('-','/',1)}"
    print(f"package name was fixed from {raw_package} to {fixed_package}")
    return fixed_package

package_build_list=[]
service_build_list=[]
get_changed_folders()
all_services=os.listdir(helm_services_folder)
for changed_folder in changed_folders:
    if is_service(all_services,changed_folder):
        if changed_folder not in service_build_list:
            service_build_list.append(changed_folder)
    else:
        services=dependet_services(changed_folder)
        for service in services:
            if service not in service_build_list:
                service_build_list.append(service)
                package_build_list.append(get_package_name(service))
    if get_package_name(changed_folder) not in package_build_list:
        package_build_list.append(get_package_name(changed_folder))


print(f"Will build the follwoing services: {service_build_list}")
with open(services_output_file, 'w') as outfile:
    service_build_list_fixed = json.dumps(service_build_list)
    json.dump(service_build_list_fixed, outfile)
print(f"Will build the follwoing pcakges: {package_build_list}")
with open(packages_output_file, 'w', encoding='utf-8') as outfile:
    package_build_list_fixed = json.dumps(package_build_list)
    json.dump(package_build_list_fixed, outfile, ensure_ascii=False, indent=4)
