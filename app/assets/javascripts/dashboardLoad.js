function dashboardLoad() {
    createLoanList();
    dashboardWrite(1);
}

function createLoanList() {
    console.log("in dashboard load");
    var jsonData = sessionStorage.getItem("jsondata");
    var jsonData = JSON.parse(jsonData);
    //Load the JSON object into an array
    var loanArray = [];
    for (var key in jsonData) {
        if (jsonData.hasOwnProperty(key)) {
            var val = jsonData[key]
            loanArray.push(val);
        }
    }

    for (var j = 0; j < loanArray.length; j++) {
        $('#loanList').append($("<li>", {
            id: j + 1,
            text: loanArray[j]["name"]
        }));
    }
}

function dashboardWrite(index) {
    console.log("in dashboardWrite");
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
}

$(document).on('click', '#1', function() {
    dashboardWrite(this["id"]);
    updateChart();
    basicMath();
});
$(document).on('click', '#2', function() {
    dashboardWrite(this["id"]);
    updateChart();
    basicMath();
});
$(document).on('click', '#3', function() {
    dashboardWrite(this["id"]);
    updateChart();
    basicMath();
});
$(document).on('click', '#4', function() {
    dashboardWrite(this["id"]);
    updateChart();
    basicMath();
});
$(document).on('click', '#5', function() {
    dashboardWrite(this["id"]);
    updateChart();
    basicMath();
});
