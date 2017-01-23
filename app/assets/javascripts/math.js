// A = [(r/n)*P] / [ 1-(1+(r/n))^-nt]
// where A is the monthly payment
// P is the principal
// r is the interest rate
// n is the compounds per period (when monthly n=12)
// t is the number of years of the loan
calc = {
    monthlyPayment: function(principal, interest_rate, compounds_per_year, years) {
        var P = principal;
        var r = interest_rate / 100;
        var n = compounds_per_year;
        var t = years;
        var expon = function(x, y) {
            return Math.pow(x, y);
        };
        var numerator = ((r / n) * P);
        var denominator = expon((1 + (r / n)), (-1 * n * t));

        return numerator / (1 - denominator);
    },

    totalInterestToPay: function(principal, interest_rate, compounds_per_year, years) {
        var P = principal;
        var r = interest_rate / 100;
        var n = compounds_per_year;
        var t = years;

        function expon(x, y) { return Math.pow(x, y); };

        var numerator = ((r / n) * P);
        var denominator = expon((1 + (r / n)), (-1 * n * t));
        var denominator = 1 - denominator;

        return (numerator * n * t) / denominator;
    },

    loanSnapshot: function() {
        var mnthlypmt = calc.monthlyPayment($('#principal').val(), $('#interest_rate').val(), $('#compounds_per_year').val(), $('#loan_years').val());
        var mnthlypmt = mnthlypmt.toFixed(2);
        $("#monthly_payment").text("$" + mnthlypmt);

        var totalIntToPay = calc.totalInterestToPay($('#principal').val(), $('#interest_rate').val(), $('#compounds_per_year').val(), $('#loan_years').val());
        var principal = $('#principal').val();
        var display_int = (totalIntToPay - principal).toFixed(2);
        $("#total_interest_to_pay").text("$" + display_int);
    }
};
