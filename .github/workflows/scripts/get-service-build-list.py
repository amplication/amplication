import os
import json
from pathlib import Path
from typing import List
import shutil
import base64
from checksumdir import dirhash


root_folder = os.getenv('GITHUB_WORKSPACE', Path(__file__).parents[3])
services_output_file = os.getenv('SERVICES_OUPTUT_PATH', os.path.join(
    root_folder, 'service_build_list.json'))
packages_output_file = os.getenv('PACKAGES_OUPTUT_PATH', os.path.join(
    root_folder, 'package_build_list.json'))
helm_services_folder = os.getenv(
    'HELM_SERVICES_FOLDER', os.path.join(root_folder, 'helm/charts/services'))
packages_folder = os.getenv(
    'PACKAGES_FOLDER', os.path.join(root_folder, 'packages'))
ee_packages_folder = os.getenv(
    'EE_PACKAGES_FOLDER', os.path.join(root_folder, 'ee/packages'))
changed_folders = []
changed_files = os.getenv('CHANGED_FILES_PR') or os.getenv(
    'CHANGED_FILES_NOT_PR')

package_build_list = []
service_build_list = []
dependecies_dict = dict()

print(f"root_folder: {root_folder}")
print(f"services_output_file: {services_output_file}")
print(f"packages_output_file: {packages_output_file}")
print(f"helm_services_folder: {helm_services_folder}")
print(f"packages_folder: {packages_folder}")
print(f"ee_packages_folder: {ee_packages_folder}")
print(f"changed_files: {changed_files}")

all_packages = os.listdir(packages_folder) + os.listdir(ee_packages_folder)


def is_service(service_list, service_name) -> bool:
    return service_name in service_list


def get_packages_folder(service_name) -> str:
    if service_name in os.listdir(packages_folder):
        return packages_folder
    return ee_packages_folder


def dependet_services(package_name, service_list) -> List[str]:
    npm_package_name = package_name.replace("-", "/", 1)
    for service in all_services:
        if service in all_packages:
            package_json = f"{get_packages_folder(service)}/{service}/package.json"
            with open(package_json, 'r') as file:
                depencies = file.read().replace('\n', '')
            if f"\"@{npm_package_name}\":" in depencies:
                print(
                    f"The service {service} depends on package {npm_package_name}, will build")
                if service not in service_list:
                    service_list.append(service)


def get_changed_folders():
    if not changed_files:
        print('no changed files')
    else:
        for changed_file in changed_files.split(','):
            folder_name = changed_file.split('/')[1]
            if "ee/packages" in changed_file:
                folder_name = changed_file.split('/')[2]
            if (folder_name not in changed_folders):
                changed_folders.append(folder_name)
    print(f"changed_folders: {changed_folders}")
    return changed_folders


def get_package_name(raw_package) -> str:
    fixed_package = f"@{raw_package.replace('-','/',1)}"
    print(f"package name was fixed from {raw_package} to {fixed_package}")
    return fixed_package


def get_dependent_packages(service_name):
    dependent_services = []
    for package in all_packages:
        dependet_services(package, dependent_services)
        if service_name in dependent_services:
            fixed_package = package.replace('-', '/')
            if f'@{fixed_package}' in package_build_list:
                dependecies_dict[service_name].append(package)

changed_folders = get_changed_folders()
all_services = os.listdir(helm_services_folder)
for changed_folder in changed_folders:
    if changed_folder in all_packages:
        if is_service(all_services, changed_folder):
            if changed_folder not in service_build_list:
                service_build_list.append(changed_folder)
        else:
            dependet_services(changed_folder, service_build_list)
        if get_package_name(changed_folder) not in package_build_list:
            package_build_list.append(get_package_name(changed_folder))
print(f"Will be build packages: {package_build_list}")

for service in all_services:
    dependecies_dict[service] = [service]
    get_dependent_packages(service)

with open(packages_output_file, 'w', encoding='utf-8') as outfile:
    package_build_list_fixed = json.dumps(package_build_list)
    json.dump(package_build_list_fixed, outfile, ensure_ascii=False, indent=4)