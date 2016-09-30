// function makeChart() {

var randomScalingFactor = function() {
      return (Math.random() > 0.5 ? 1.0 : 0.1) * Math.round(Math.random() * 100);
  };
  var randomColorFactor = function() {
      return Math.round(Math.random() * 255);
  };
  var labells = ["January", "February", "March", "April", "May", "June", "July", "August"];

  var barChartData = {
      labels: labells,
      datasets: [{
          label: 'Dataset 1',
          backgroundColor: "rgba(220,220,220,0.5)",
          data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(),randomScalingFactor()]
      }, {
          label: 'Dataset 2',
          backgroundColor: "rgba(151,187,205,0.5)",
          data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]
      }]
  };
  window.onload = function() {
      var ctx = document.getElementById("canvas").getContext("2d");
      window.myBar = new Chart(ctx, {
          type: 'bar',
          data: barChartData,
          options: {
              title:{
                  display:true,
                  text:"Chart.js Bar Chart - Stacked"
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
// };
