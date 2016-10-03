
function updateChart() {
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

$(document).ready( function() {
    $('#principal').on('change', function(event) {
        updateChart();
    });
});
