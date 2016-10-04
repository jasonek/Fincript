
function updateChart() {
    console.log("in updateChart");
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
};

$(document).ready( function() {
    $('#principal').on('change', function(event) {
        updateChart();
        basicMath();
    });

    $('#interest_rate').on('change', function(event) {
        updateChart();
        basicMath();
    });

    $('#compounds_per_year').on('change', function(event) {
        updateChart();
        basicMath();
    });

    $('#loan_years').on('change', function(event) {
        updateChart();
        basicMath();
    });

    $('#terminal_date').on('change', function(event) {
        updateChart();
        basicMath();
    });

});
