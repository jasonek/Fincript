
function findTodayInArray(dateArray) {
    var maturity_date = moment($('#terminal_date').val());
    var maturity_day = maturity_date.date();
    var now = moment();
    var next_payment = now.date(maturity_day);
    var next_payment_formatted = next_payment.format('YYYY MM DD');

    for (var i = 0; i < dateArray.length; i++) {
        if (dateArray[i][4] == next_payment_formatted) {
            return i;
        }
    }
    //TODO: Handle when i dont find a date
}



var labells = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var zeroes_data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var chartDataPrincipal = function() {
    var dateArray = getDataSet().schedule;

    var dateSpecificPrincipal = function(i) {
        var startingMonthIndex = findTodayInArray(dateArray);
        return dateArray[startingMonthIndex + i][1];
    };

    if ($('#principal').val() === null || $('#principal').val() === "") {
        return zeroes_data;
    } else {
        var principal_data = [dateSpecificPrincipal(0), dateSpecificPrincipal(1), dateSpecificPrincipal(2), dateSpecificPrincipal(3), dateSpecificPrincipal(4), dateSpecificPrincipal(5), dateSpecificPrincipal(6), dateSpecificPrincipal(7), dateSpecificPrincipal(8), dateSpecificPrincipal(9), dateSpecificPrincipal(10), dateSpecificPrincipal(11)];
        return principal_data;
    }
};

var chartDataInterest = function() {

    var dateArray = getDataSet().schedule;

    var dateSpecificInterest = function(i) {
        var starting_month = findTodayInArray(dateArray);
        return dateArray[starting_month + i][2];
    };

    if ($('#interest_rate').val() === null || $('#interest_rate').val() === "") {
        return zeroes_data;
    } else {
        var interest_data = [dateSpecificInterest(0), dateSpecificInterest(1), dateSpecificInterest(2), dateSpecificInterest(3), dateSpecificInterest(4), dateSpecificInterest(5), dateSpecificInterest(6), dateSpecificInterest(7), dateSpecificInterest(8), dateSpecificInterest(9), dateSpecificInterest(10), dateSpecificInterest(11)];
        return interest_data;
    }
};

$('.sessions.dashboard').on('ready', function(){
    Dashboard.update();
});
