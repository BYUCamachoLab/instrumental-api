from flask import Flask
from subprocess import Popen
import os

app = Flask(__name__)

servers = []

@app.route('/')
def hello():
    return "Welcome to the subserver API for instrumental-api."

@app.route('/start')
def run_server():
    path = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'Instrumental', 'tools', 'instr_server.py')
    s = Popen(['python', path])
    servers.append(s)
    return str(s.pid) + ": Please remember to go to /stop when you're finished."

@app.route('/stop')
def shutdown():
    for s in servers:
        s.kill()
        servers.remove(s)
    return('Server stopped.')

if __name__ == '__main__':
    app.run(debug=True)
    