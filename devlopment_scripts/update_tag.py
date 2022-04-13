import ruamel.yaml
import io,sys

tag = sys.argv[1]
service_name = sys.argv[2]
service_values = f'helm_gal/charts/services/{service_name}/values.yaml'
print(f'tag : {tag}')

with open(service_values, 'r') as stream:
    data_loaded = ruamel.yaml.round_trip_load(stream, preserve_quotes=True)
    data_loaded['deployment']['image']['tag'] = tag
with io.open(service_values, 'w', encoding='utf8') as outfile:
    ruamel.yaml.round_trip_dump(data_loaded, outfile, explicit_start=True)

