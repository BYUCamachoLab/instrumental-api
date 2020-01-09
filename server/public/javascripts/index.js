var app = new Vue({
    el: '#app',
    data: {
        machines: [],
    },
    created() {
        console.log("Index created!")
        this.getMachines();
    },
    methods: {
        async getMachines() {
            console.log("index.js getMachines()")
            try {
                let response = await axios.get("/api/subservers");
                this.machines = response.data;
                for (let i = 0; i < this.machines.length; i++) {
                    let then = moment(this.machines[i].updated);
                    let now = moment();
                    let ms = moment.duration(now.diff(then));
                    let time_since = '';
                    if (ms.days() > 28) {
                        time_since = then.format("DD MMM YYYY")
                    }
                    else if (ms.days() > 0) {
                        time_since = (ms.days() > 1) ? ms.days() + " days ago" : ms.days() + " day ago";
                    } else if (ms.hours() > 0) {
                        time_since = (ms.hours() > 1) ? ms.hours() + " hours ago" : ms.hours() + " hour ago";
                    } else if (ms.minutes() > 0) {
                        time_since = (ms.minutes() > 1) ? ms.minutes() + " minutes ago" : ms.minutes() + " minute ago";
                    } else {
                        time_since = ms.seconds() + " seconds ago";
                    }
                    this.machines[i].time_since = time_since;
                }
                return true;
            } catch (error) {
                console.log(error);
            }
        },
        async startMachine(machine) {
            console.log("index.js startMachine() for id " + machine.id);
            try {
                let response = await axios.get("/api/subservers/start/" + machine.id);
                console.log(response.data);
                this.getMachines()
                return true;
            } catch (error) {
                console.log(error);
            }
        },
        async stopMachine(machine) {
            console.log("index.js stopMachine() for id " + machine.id);
            try {
                let response = await axios.get("/api/subservers/stop/" + machine.id);
                console.log(response.data);
                this.getMachines()
                return true;
            } catch (error) {
                console.log(error);
            }
        }
    }
});