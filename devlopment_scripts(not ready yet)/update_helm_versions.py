
import base64,json,os
import yaml
import io
filespaths = ["./helm_gal/charts/services/amplication-client/Chart.yaml","./helm_gal/charts/services/amplication-server/Chart.yaml",'./helm_gal/charts/amplication/Chart.yaml']
# build_number = '0.1.1'
# for file in filespaths:
#     if file == './helm_gal/charts/amplication/Chart.yaml':
#         os.system(f'sed -i "s/version: 0.1.0/version: 0.1.420/g" {file}')
#         os.system(f'sed -i "s/version: "0.1.0"/version: "0.1.420"/g" {file}')
#     else:
#         os.system(f'sed -i "s/version: 0.1.0/version: 0.1.420/g" {file}')

# # Define data
# data = {
#     'a list': [
#         1, 
#         42, 
#         3.141, 
#         1337, 
#         'help', 
#         u'€'
#     ],
#     'a string': 'bla',
#     'another dict': {
#         'foo': 'bar',
#         'key': 'value',
#         'the answer': 42
#     }
# }

# # Write YAML file
# with io.open('data.yaml', 'w', encoding='utf8') as outfile:
#     yaml.dump(data, outfile, default_flow_style=False, allow_unicode=True)

# Read YAML file
with open("./helm_gal/charts/services/amplication-client/Chart.yaml", 'r') as stream:
    data_loaded = yaml.safe_load(stream)
    data_loaded['version'] = build_number

print(f'data == {data_loaded}')
print(data_loaded['version'])























    # with open(f'{file}', "r") as f:
    #     lines = f.readlines()
    # with open(f'{file}', "w") as f2:
    #     for line in lines:
    #         tmp = line.strip("\n")
    #         if file == 'helm_gal\charts\amplication\Chart.yaml':
    #             if 'version: 0.1.0' in tmp or 'version: "0.1.0"' in tmp:
    #                 print(tmp)
    #                 tmp1 = tmp.replace('0.1.0',build_number)
    #                 # print(f'{file} : {tmp1}')
    #                 f2.write(tmp1)
    #             else:
    #                 f2.write(tmp)
    #         else:
    #             if 'version: 0.1.0' in tmp:
    #                 print(tmp)    
    #                 tmp1 = tmp.replace('0.1.0',build_number)
    #                 print(tmp1)
    #             f2.write(tmp)























