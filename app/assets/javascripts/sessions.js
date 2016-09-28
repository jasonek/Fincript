$(function() {
    $.ajax({
        type: "GET",
        url: "/sessions/api",
        async: true,
        success: rawencryptedjson,
        error: handleError
    })

    function rawencryptedjson(response) {
        var decoded_json = atob(response);
        $('.rawencryptedjson').append(decoded_json);
        var key = $("#userkey").text();
        // console.log(response);
        var dectd = sjcl.decrypt(key, response);
        console.log(dectd);
    };

    function handleError(error) {
        console.log("Error");
        console.log(error.responseText);
    };

})
