import ruamel.yaml
import io,sys,os,shutil

build_number = sys.argv[1]
service_name = sys.argv[2]
service_chart = f'helm/helm_chart/charts/services/{service_name}/Chart.yaml'
umbrella_chart = 'helm/helm_chart/charts/amplication/Chart.yaml'

print(f'build number : {build_number}')

def my_function(version):
  splited_version = version.split('.')
  return f'{splited_version[0]}.{splited_version[1]}.{build_number}'

#update service chart:
with open(service_chart, 'r') as stream:
    data_loaded = ruamel.yaml.round_trip_load(stream, preserve_quotes=True)
    version = my_function(data_loaded['version'])
    data_loaded['version'] = version
with io.open(service_chart, 'w', encoding='utf8') as outfile:
    ruamel.yaml.round_trip_dump(data_loaded, outfile, explicit_start=True)


#update umbrella chart:
if service_name == 'amplication-client':
    num = 0
else: 
    num = 1

with open(umbrella_chart, 'r') as stream:
    data_loaded = ruamel.yaml.round_trip_load(stream, preserve_quotes=True)
    version = my_function(data_loaded['dependencies'][num]['version'])
    old_version = data_loaded['dependencies'][num]['version']
    new_version = version
    data_loaded['dependencies'][num]['version'] = version
    version = my_function(data_loaded['version'])
    data_loaded['version'] = version
with io.open(umbrella_chart, 'w', encoding='utf8') as outfile:
    ruamel.yaml.round_trip_dump(data_loaded, outfile, explicit_start=True)

#build new package:
os.remove(f'helm/helm_chart/charts/amplication/charts/{service_name}-{old_version}.tgz')
os.system(f'helm package helm/helm_chart/charts/services/{service_name}')

source_dir = './'
target_dir = 'helm/helm_chart/charts/amplication/charts/'
file_name = f'{service_name}-{new_version}.tgz'

shutil.move(os.path.join(source_dir, file_name), target_dir)
