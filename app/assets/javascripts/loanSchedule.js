
function pmt(rate,nper,pv) {
    var pvif, pmt;

    pvif = Math.pow( 1 + rate, nper);
    pmt = rate / (pvif - 1) * -(pv * pvif);

    return pmt;
};

function makeDateArray(loan_duration){
    var terminal_date = $('#terminal_date').val();
    var last_date = moment(terminal_date);
    var mydate = moment(terminal_date);
    var starting_date = mydate.subtract(loan_duration,'years').format('YYYY MM DD');

    var dateArr = [];
    var current_date = moment(starting_date);
    while (current_date <= last_date) {
        dateArr.push(moment(current_date).format('YYYY MM DD'));
        current_date = moment(current_date).add(1,'months')
    }
    return dateArr;
};

function computeSchedule(principal, interest_rate, compounds_per_year, loan_duration, payment) {
    var schedule = [];
    var remaining = principal;
    var number_of_payments = compounds_per_year * loan_duration;
    var dates = makeDateArray(loan_duration);

    for (var i=0; i<=number_of_payments; i++) {
        var interest = remaining * (interest_rate/100/compounds_per_year);
        interest = interest.toFixed(2);
        var principal = (payment-interest);
        principal = principal.toFixed(2);
        var row = [i, principal>0?(principal<payment?principal:payment):0, interest>0?interest:0, remaining>0?remaining:0, dates[i]];
        schedule.push(row);
        remaining -= principal
    }
    return schedule;
};

function getDataSet() {
    var output = {};
    var loanAmount = output.loanAmount = parseFloat( $('#principal').val() );
    var interestRate = output.interestRate = parseFloat( $('#interest_rate').val() );
    var compoundsPerYear = output.compoundsPerYear = parseInt( $('#compounds_per_year').val() );
    var years = output.years = parseInt( $('#loan_years').val() );
    var numberOfPayments = output.numberOfPayments = compoundsPerYear * years;

    var payment = output.payment = pmt(interestRate/100/compoundsPerYear, numberOfPayments, -loanAmount);

    output.schedule = computeSchedule( loanAmount,
                                       interestRate,
                                       compoundsPerYear,
                                       years,
                                       payment );
    return output;
};
