Dashboard = {
    load: function() {
        Dashboard.createLoanList();
        Dashboard.write(1); //first time loading the file, use loan 1 to populate chart
    },

    createLoanList: function() {
        var jsonData = sessionStorage.getItem("jsondata");
        var jsonData = JSON.parse(jsonData);

        //Load the JSON object into an array:
        var loanArray = [];
        for (var key in jsonData) {
            if (jsonData.hasOwnProperty(key)) {
                var val = jsonData[key]
                loanArray.push(val);
            }
        }

        //create a list of loans on the left hand side of the web page
        for (var j = 0; j < loanArray.length; j++) {
            $('#loanList').append($("<li>", {
                id: j + 1,
                text: loanArray[j]["name"]
            }));
        }
    },

    write: function(index) {

        var jsonData = sessionStorage.getItem("jsondata");
        var jsonData = JSON.parse(jsonData);

        var loanArray = [];
        for (var key in jsonData) {
            if (jsonData.hasOwnProperty(key)) {
                var val = jsonData[key]
                loanArray.push(val);
            }
        }

        var i = index;
        var activeLoan = function(i) {
            i = i - 1; //to account for index 0 being first position
            return loanArray[i];
        }

        $('#principal').val(activeLoan(i)["principal"]);
        $('#interest_rate').val(activeLoan(i)["interest rate"]);
        $('#compounds_per_year').val(activeLoan(i)["compounds per year"]);
        $('#loan_years').val(activeLoan(i)["years of loan"]);
        $('#terminal_date').val(activeLoan(i)["maturity date"]);
    },

    update: function() {
        var barChartData = {
            labels: labells,
            datasets: [{
                label: 'Principal',
                backgroundColor: "#18BBEF",
                data: chartDataPrincipal()
            }, {
                label: 'Interest',
                backgroundColor: "#F39333",
                data: chartDataInterest()
            }]
        };
        var ctx = document.getElementById("canvas").getContext("2d");
        window.myBar = new Chart(ctx, {
            type: 'bar',
            data: barChartData,
            options: {
                title: {
                    display: true,
                    text: "Monthly Loan Interest and Principal"
                },
                tooltips: {
                    mode: 'label'
                },
                responsive: true,
                scales: {
                    xAxes: [{
                        stacked: true,
                    }],
                    yAxes: [{
                        stacked: true
                    }]
                }
            }
        });
    }
}
