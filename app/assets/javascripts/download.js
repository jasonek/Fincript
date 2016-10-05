$(function() {
        retrieveDataFromServer( sessionStorage.getItem("cryptoKey") );
    }) //end OnLoad

function retrieveDataFromServer(key) {
    console.log("key is: " + key);

    $.ajax({
        type: "GET",
        url: "/sessions/api",
        async: true,
        success: getEncryptedJson,
        error: handleError
    })

    function getEncryptedJson(encodedJson) {
        console.log("encoded: " + encodedJson);
        var decodedJson = atob(encodedJson);
        console.log("decoded but encrypted" + decodedJson);
        var clearText = sjcl.decrypt(key, decodedJson);
        console.log("clear text: "+ clearText);
        sessionStorage.setItem("jsondata", clearText);
        dashboardLoad();
        updateChart();
        basicMath();
    };

    function handleError(error) {
        console.log("Error");
        console.log(error.responseText);
    };

}
