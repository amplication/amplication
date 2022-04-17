import ruamel.yaml,json
import io,sys,os,shutil

build_number = sys.argv[1]
branch_name = sys.argv[2]
services_list = sys.argv[3]
print(f'build number : {build_number}')
print(f'services : {services_list}')
print(f'branch : {branch_name}')
tmp = services_list[1:-1]
services = tmp.split(", ")
umbrella_chart = 'helm/helm_chart/charts/amplication/Chart.yaml'

def create_version(version):
  splited_version = version.split('.')
  return f'{splited_version[0]}.{splited_version[1]}.{build_number}'

def update_helm(service, chart_path):
    print(f'service : {service}')

    service_chart = chart_path
    #update service chart:
    with open(service_chart, 'r') as stream:
        data_loaded = ruamel.yaml.round_trip_load(stream, preserve_quotes=True)
        version = create_version(data_loaded['version'])
        data_loaded['version'] = version
        data_loaded['appVersion'] = version
    with io.open(service_chart, 'w', encoding='utf8') as outfile:
        ruamel.yaml.round_trip_dump(data_loaded, outfile, explicit_start=True)


    #update umbrella chart:
    if service == 'amplication-client':
        num = 0
    else: 
        num = 1

    with open(umbrella_chart, 'r') as stream:
        data_loaded = ruamel.yaml.round_trip_load(stream, preserve_quotes=True)
        version = create_version(data_loaded['dependencies'][num]['version'])
        data_loaded['dependencies'][num]['version'] = version
        version = create_version(data_loaded['version'])
        data_loaded['version'] = version
        version = create_version(data_loaded['appVersion'])
        data_loaded['appVersion'] = version
    with io.open(umbrella_chart, 'w', encoding='utf8') as outfile:
        ruamel.yaml.round_trip_dump(data_loaded, outfile, explicit_start=True)

for service in services:
    chart_path = f'helm/helm_chart/charts/services/{service}/Chart.yaml'
    update_helm(service, chart_path)
    
if 'amplication-client' not in services:
    print("amplication-client package has no updates")
    service = 'amplication-client'
    chart_path = f'/downloaded_helms/{service}/Chart.yaml'
    update_helm(service, chart_path)

if 'amplication-server' not in services:
    print("amplication-server package has no updates")
    service = 'amplication-server'
    chart_path = f'/downloaded_helms/{service}/Chart.yaml'
    update_helm(service, chart_path)
