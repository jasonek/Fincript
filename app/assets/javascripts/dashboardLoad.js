    function dashboardLoad() {
        var jsonData = $("body").data("jsondata");
        var jsonData = JSON.parse(jsonData);
        var loan1 = jsonData["loan1"];
        var loan1_name = loan1["name"];
        var loan1_principal = loan1["principal"];
        var loan1_interest_rate = loan1["interest rate"];
        var loan1_compounds_per_year = loan1["compounds per year"];
        var loan1_years = loan1["years of loan"];
        var loan1_maturity_date = loan1["maturity date"];

        $('#principal').val(loan1_principal);
        $('#interest_rate').val(loan1_interest_rate);
        $('#compounds_per_year').val(loan1_compounds_per_year);
        $('#years').val(loan1_years);
        $('#terminal_date').val(loan1_maturity_date);
    }
