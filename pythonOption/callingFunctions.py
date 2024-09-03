from functions import *

mineralKeyword = {
    "tableMineralsList" : [">Cobalt<",">Tin<",">Lithium<", ">Gold<", ">Copper<", ">Gallium<", ">Aluminum<", ">Nickel<", ">Silicon<", ">Germanium<"],
    "mineralsList"      : ["Cobalt", "Lithium", "Gold", "Copper", "Gallium", "Aluminum", "Nickel", "Silicon", "Germanium"],
    "mineralsString"    : " \"Cobalt\" OR \"Lithium\" OR \"Gold\" OR \"Copper\" OR \"Gallium\" OR \"Aluminum\" OR \"Nickel\" OR \"Silicon\" OR \"Germanium\" ",
    "companies"         : ["Tesla","Microsoft", "Micron", "Analog Devices", "Qorvo", "Qualcomm", "Lam Research Corporation", "Motorino", "Greenwit Technologies", "AllCell Technologies", "Bird Rides", "Hyundai", "SK Innovation", "Volkswagen", "Renault", "Nissan", "Mitsubishi", "Renault-Nissan-Mitsubishi-Alliance", "General Motors", "Toyota", "Missouri Cobalt", "L-H Battery", "Ultium", "LG Energy Solution", "Samsung", "Ford",  "Vale S.A.", "Li-Cycle Holdings", "Ascend Elements", "Electra", "Panasonic", "Neutron Holdings", "Mahindra", "EVelution Energy"],
    "cik"               : ["0001318605", "0000789019", "0000723125", "0000006281", "0001604778", "0000804328", "0000707549"],
    "auditors"          : ["Responsible Minerals Initiative", "RMI", "Responsible Business Alliance", "RBA", "Fair Trade"],
    "formTypes"         : ["SD"]
}

params = {
  "query": mineralKeyword["companies"][0] ,
  "formTypes": mineralKeyword["formTypes"],
}


metalKeywords = mineralKeyword["tableMineralsList"]
auditKeywords = mineralKeyword["auditors"]

for i in range(len(mineralKeyword["companies"])):
 # print(i)
  params = {
  "query": mineralKeyword["companies"][i] ,
  "formTypes": mineralKeyword["formTypes"],
  }
  print(params)
  f = searchApiCall(params,csvData,metalKeywords,auditKeywords)
f.to_csv('output.csv', index=False)  