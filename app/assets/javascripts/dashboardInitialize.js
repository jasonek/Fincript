Dashboard.load();

$(document).on('click', '#1', function() {
    Dashboard.write(this.id);
    Dashboard.update();
    basicMath();
});
$(document).on('click', '#2', function() {
    Dashboard.write(this.id);
    Dashboard.update();
    basicMath();
});
$(document).on('click', '#3', function() {
    Dashboard.write(this.id);
    Dashboard.update();
    basicMath();
});
$(document).on('click', '#4', function() {
    Dashboard.write(this.id);
    Dashboard.update();
    basicMath();
});
$(document).on('click', '#5', function() {
    Dashboard.write(this.id);
    Dashboard.update();
    basicMath();
});


$(document).ready(function() {
    $('#principal').on('change', function(event) {
        Dashboard.update();
        basicMath();
    });

    $('#interest_rate').on('change', function(event) {
        Dashboard.update();
        basicMath();
    });

    $('#compounds_per_year').on('change', function(event) {
        Dashboard.update();
        basicMath();
    });

    $('#loan_years').on('change', function(event) {
        Dashboard.update();
        basicMath();
    });

    $('#terminal_date').on('change', function(event) {
        Dashboard.update();
        basicMath();
    });

});
