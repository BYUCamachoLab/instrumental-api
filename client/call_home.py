import requests, json, socket
from collections import namedtuple

EE_TAG = 'EE1574'
ALIAS = 'Machine3'
IP = [(s.connect(('8.8.8.8', 53)), s.getsockname()[0], s.close()) for s in [socket.socket(socket.AF_INET, socket.SOCK_DGRAM)]][0][1]
ID = None

# Get a list of all machines known to the server
url = 'http://localhost:8000/api/machines/'
r = requests.get(url)
known_machines = json.loads(r.content, object_hook=lambda d: namedtuple('machine', d.keys())(*d.values()))

# Match our computer to the list of known machines
for machine in known_machines:
    if EE_TAG in machine.ee_tag:
        ID = machine.id

if ID is not None:
    url = "http://localhost:8000/api/machines/" + str(ID) + "/"
    data = json.dumps({"ip": IP})
    headers = {'content-type': 'application/json'}
    r = requests.put(url, data, auth=('EE10090', 'SomePassword'), headers=headers)

    print(r, r.content)
    