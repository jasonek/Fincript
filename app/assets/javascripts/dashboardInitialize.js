Dashboard.load();

$(document).on('click', '#1', function() {
    Dashboard.write(this.id);
    Dashboard.update();
    loanSnapshot();
});
$(document).on('click', '#2', function() {
    Dashboard.write(this.id);
    Dashboard.update();
    loanSnapshot();
});
$(document).on('click', '#3', function() {
    Dashboard.write(this.id);
    Dashboard.update();
    loanSnapshot();
});
$(document).on('click', '#4', function() {
    Dashboard.write(this.id);
    Dashboard.update();
    loanSnapshot();
});
$(document).on('click', '#5', function() {
    Dashboard.write(this.id);
    Dashboard.update();
    loanSnapshot();
});


$(document).ready(function() {
    $('#principal').on('change', function(event) {
        Dashboard.update();
        loanSnapshot();
    });

    $('#interest_rate').on('change', function(event) {
        Dashboard.update();
        loanSnapshot();
    });

    $('#compounds_per_year').on('change', function(event) {
        Dashboard.update();
        loanSnapshot();
    });

    $('#loan_years').on('change', function(event) {
        Dashboard.update();
        loanSnapshot();
    });

    $('#terminal_date').on('change', function(event) {
        Dashboard.update();
        loanSnapshot();
    });

});
