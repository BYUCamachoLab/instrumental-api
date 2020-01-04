import requests, json, socket
from collections import namedtuple

EE_TAG = 'EE1574'
NAME = 'Sequoias Computer'
DESCRIPTION = 'Lab computer not hooked up to any instruments'
IP = [(s.connect(('8.8.8.8', 53)), s.getsockname()[0], s.close()) for s in [socket.socket(socket.AF_INET, socket.SOCK_DGRAM)]][0][1]
ID = None

# Get a list of all machines known to the server
url = 'http://localhost:3000/api/subservers'
r = requests.get(url)
known_machines = json.loads(r.content, object_hook=lambda d: namedtuple('machine', d.keys(), rename=True)(*d.values()))

# Match our computer to the list of known machines
for machine in known_machines:
    if EE_TAG in machine.ee_tag:
        ID = machine.id
        print("Matching id found")

if ID is not None:
    url = "http://localhost:3000/api/subservers/" + str(ID)
    data = json.dumps({"name": NAME, "description": DESCRIPTION, "ip": IP})
    headers = {'content-type': 'application/json'}
    r = requests.put(url, data, headers=headers)

    print(r, r.content)
    
else:
    url = "http://localhost:3000/api/subservers"
    data = json.dumps({"ee_tag": EE_TAG, "name": NAME, "description": DESCRIPTION, "ip": IP})
    headers = {'content-type': 'application/json'}
    r = requests.post(url, data, headers=headers)

    print(r, r.content)