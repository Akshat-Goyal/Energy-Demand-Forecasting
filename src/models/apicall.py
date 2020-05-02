# import requests

# URL = "http://api.openweathermap.org/data/2.5/forecast?id=1269843&appid=95e286bae5647877dbb924f3779736a8&units=imperial"

# r = requests.get(url=URL)

# data = r.json()

# for ind in range(len(data['list'])):
#     print(data['list'][ind]['dt_txt'])
#     print(data['list'][ind]['main']['temp'])
#     print('\n')
from datetime import datetime

datetime_str = '09-19-2018 13:55:26'

datetime_object = datetime.strptime(datetime_str, '%m-%d-%Y %H:%M:%S')

print(type(datetime_object))
print(datetime_object)  # printed in default format
