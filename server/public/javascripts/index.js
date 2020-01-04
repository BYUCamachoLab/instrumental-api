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
            console.log("index.js getItems()")
            try {
                let response = await axios.get("/api/subservers");
                this.machines = response.data;
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
                // TODO: Refresh machine list on response
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
                // TODO: Refresh machine list on response
                return true;
            } catch (error) {
                console.log(error);
            }
        }
    }
});