
function findTodayInArray() {
    var maturity_date = moment($('#terminal_date').val());
    var maturity_day = maturity_date.date();
    var now = moment();
    var next_payment = now.date(maturity_day);
    var next_payment_formatted = next_payment.format('YYYY MM DD');

    var dateArray = getDataSet().schedule;
    for (var i = 0; i <= dateArray.length; i++) {
        if (dateArray[i][4] == next_payment_formatted) {
            return i;
        }
    }
};

var dateSpecificPrincipal = function(i) {
    var dateArray = getDataSet().schedule;
    var starting_month = findTodayInArray();
    return dateArray[starting_month + i][1];
}

var dateSpecificInterest = function(i) {
    var dateArray = getDataSet().schedule;
    var starting_month = findTodayInArray();
    return dateArray[starting_month + i][2];
}

var labells = ["January", "February", "March", "April", "May", "June", "July", "August"];
var zeroes_data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var principal_data = [dateSpecificPrincipal(0), dateSpecificPrincipal(1), dateSpecificPrincipal(2), dateSpecificPrincipal(3), dateSpecificPrincipal(4), dateSpecificPrincipal(5), dateSpecificPrincipal(6), dateSpecificPrincipal(7), dateSpecificPrincipal(8), dateSpecificPrincipal(9), dateSpecificPrincipal(10), dateSpecificPrincipal(11)];
var interest_data = [dateSpecificInterest(0), dateSpecificInterest(1), dateSpecificInterest(2), dateSpecificInterest(3), dateSpecificInterest(4), dateSpecificInterest(5), dateSpecificInterest(6), dateSpecificInterest(7), dateSpecificInterest(8), dateSpecificInterest(9), dateSpecificInterest(10), dateSpecificInterest(11)];

var chartDataPrincipal = function() {
    if ($('#principal').val() === null || $('#principal').val() === "") {
        return zeroes_data;
    } else {
        return principal_data;
    }
};

var chartDataInterest = function() {
    if ($('#principal').val() === null || $('#principal').val() === "") {
        return zeroes_data;
    } else {
        return principal_data;
    }
};

var barChartData = {
    labels: labells,
    datasets: [{
        label: 'Principal',
        backgroundColor: "rgba(220,220,220,0.5)",
        data: chartDataPrincipal()
    }, {
        label: 'Interest',
        backgroundColor: "rgba(151,187,205,0.5)",
        data: chartDataInterest()
    }]
};
window.onload = function() {
    var ctx = document.getElementById("canvas").getContext("2d");
    window.myBar = new Chart(ctx, {
        type: 'bar',
        data: barChartData,
        options: {
            title: {
                display: true,
                text: "Chart.js Bar Chart - Stacked"
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
};
