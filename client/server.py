from flask import Flask
from subprocess import Popen
import os
from datetime import datetime

from waitress import serve

from apscheduler.schedulers.background import BackgroundScheduler

### FLASK APP ###

app = Flask(__name__)

servers = []

request_list = []

@app.route('/')
def hello():
    request_list.insert(0, "%s INDEX" % datetime.now())
    string = "Welcome to the subserver API for instrumental-api.<br>"
    string += "<br><h3>Request History</h3><br>"
    for line in request_list:
        string += line + "<br>"
    return string

@app.route('/start')
def run_server():
    try:
        request_list.insert(0, "%s START" % datetime.now())
        path = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'instr_server.py')
        s = Popen(['python', path])
        servers.append(s)
        return str(s.pid) + ": Please remember to go to /stop when you're finished."
    except:
        print("500 Server Error")
        return "500 Server Error"

@app.route('/stop')
def shutdown():
    request_list.insert(0, "%s STOP" % datetime.now())
    for s in servers:
        s.kill()
        servers.remove(s)
    return('Server stopped.')

### CALL HOME ###

import requests, json, socket
from collections import namedtuple
def call_home():
    EE_TAG = 'EE1574'
    NAME = 'Sequoias Computer'
    DESCRIPTION = 'Lab computer not hooked up to any instruments'


    IP = [(s.connect(('8.8.8.8', 53)), s.getsockname()[0], s.close()) for s in [socket.socket(socket.AF_INET, socket.SOCK_DGRAM)]][0][1]
    PORT = 8000
    ID = None

    # Get a list of all machines known to the server
    url = 'http://10.2.118.119:8080/api/subservers/'
    r = requests.get(url)
    known_machines = json.loads(r.content, object_hook=lambda d: namedtuple('machine', d.keys(), rename=True)(*d.values()))

    # Match our computer to the list of known machines
    for machine in known_machines:
        if EE_TAG in machine.ee_tag:
            ID = machine.id
            print("Matching id found")

    if ID is not None:
        data = json.dumps({"name": NAME, "description": DESCRIPTION, "ip": IP, "port": PORT})
        headers = {'content-type': 'application/json'}
        r = requests.put(url + str(ID), data, headers=headers)
        print(r, r.content)
        
    else:
        data = json.dumps({"ee_tag": EE_TAG, "name": NAME, "description": DESCRIPTION, "ip": IP, "port": PORT})
        headers = {'content-type': 'application/json'}
        r = requests.post(url, data, headers=headers)
        print(r, r.content)


if __name__ == '__main__':
    call_home()
    scheduler = BackgroundScheduler()
    scheduler.add_job(call_home, 'interval', minutes=1)
    scheduler.start()
    try:
        serve(app, host='0.0.0.0', port=8000, threads=4)
    except:
        scheduler.shutdown()
    