const app = new Vue({
    el: "#app",
    data: () => ({
        pageTitle: "Please login to view student data",
        username: "",
        password: "",
        isAuthorized: false,
        badLoginAttempted: false,
        students: [],
        tableFields: [
            {name: "name"},
            {name: "age"},
            {name: "picture", type: "picture"},
            {name: "balance", type: "currency"},
            {name: "tags", type: "list"},
            {name: "registered"},
            {name: "favoriteFruit"},
        ],
        dollarsToAdd: 1000,
    }),
    methods: {
        async login() {
            try {
                await this.authorize();
                this.isAuthorized = true;
                this.pageTitle = "Welcome to the student dashboard";
                this.fetchStudents();
            }
            catch (err) {
                this.badLoginAttempted = true;
            }
        },
        async authorize() {
            const url = "https://kitmjavascript.azurewebsites.net/api/login";
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "username": this.username,
                    "password": this.password,
                })
            });
            const json = await res.json();
            if (!json.isSuccessStatusCode) {
                throw new Error(json.statusCode);
            }
        },
        async fetchStudents() {
            const res = await fetch("https://kitmjavascript.azurewebsites.net/api/studentai");
            this.students = await res.json();
        },
        modifyBalance(amount) {
            const studentMoney = JSON.parse(amount.toString().replace(/[$,]+/g, ""));
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2
            });

            return formatter.format(studentMoney + this.dollarsToAdd);
        },
    },
    computed: {
        activeStudents() {
            return this.students.filter(student => student.isActive);
        }
    }
});