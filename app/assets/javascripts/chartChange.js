$('#principal').on('keyup keypress blur change', function(event) {
    // alert(event.type); // keyup OR keypress OR blur OR change
});

function updateChart() {

};

function findTodayInArray() {
    var maturity_date = moment($('#terminal_date').val());
    var maturity_day = maturity_date.date();
    var now = moment();
    var next_payment = now.date(maturity_day);
    var next_payment_formatted = next_payment.format('YYYY MM DD');

    var dateArray = getDataSet().schedule;
    for (var i=0; i<=dateArray.length; i++){
        if (dateArray[i][4] == next_payment_formatted){
            // console.log(dateArray[i]);
            return i;
        }
    }
    // var starting_position_in_array = dateArray.indexOf(String(next_payment_formatted));

};
