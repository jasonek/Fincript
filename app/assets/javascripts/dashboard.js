    function dashboard() {
        var jsonData = $("body").data("jsondata");
        console.log("in dashboard");
        var jsonData = JSON.parse(jsonData);
        console.log(jsonData["username"]);
    }
