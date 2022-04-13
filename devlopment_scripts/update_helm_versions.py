import ruamel.yaml
import io,sys

filespaths = ["helm/helm_chart/charts/services/amplication-client/Chart.yaml","helm/helm_chart/charts/services/amplication-server/Chart.yaml",'helm/helm_chart/charts/amplication/Chart.yaml']
build_number = sys.argv[1]
print(build_number)

def my_function(version):
  splited_version = version.split('.')
  return f'{splited_version[0]}.{splited_version[1]}.{build_number}'

for file in filespaths:
    if file == './helm_gal/charts/amplication/Chart.yaml':
        with open(file, 'r') as stream:
            data_loaded = ruamel.yaml.round_trip_load(stream, preserve_quotes=True)
            version = my_function(data_loaded['dependencies'][0]['version'])
            data_loaded['dependencies'][0]['version'] = version
            version = my_function(data_loaded['dependencies'][1]['version'])
            data_loaded['dependencies'][1]['version'] = version
            version = my_function(data_loaded['version'])
            data_loaded['version'] = version
        with io.open(file, 'w', encoding='utf8') as outfile:
            ruamel.yaml.round_trip_dump(data_loaded, outfile, explicit_start=True)
    else:
        with open(file, 'r') as stream:
            data_loaded = ruamel.yaml.round_trip_load(stream, preserve_quotes=True)
            version = my_function(data_loaded['version'])
            data_loaded['version'] = version
        with io.open(file, 'w', encoding='utf8') as outfile:
            ruamel.yaml.round_trip_dump(data_loaded, outfile, explicit_start=True)