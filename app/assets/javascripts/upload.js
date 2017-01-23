$(function() { //on page load

    var fileInput = document.getElementById('uploadFile');

    fileInput.addEventListener('change', function(e) {
        var file = fileInput.files[0];
        var textType = /text.*/;
        var reader;

        if (file.type.match(textType)) {
            reader = new FileReader();
            reader.onload = function(e) {
                sessionStorage.setItem("jsondata", reader.result);
                $('#uploadPreview').append(reader.result);
            };
        } else {
            fileDisplayArea.innerText = "File not supported!";
        }
        reader.readAsText(file);
    });

    $("#encryptAndUploadToServer").click(function() {
        var userCleartextPassword = $("#userkeyEncrypt").text(this).val();
        $("#userkeyEncrypt").val('');
        generateUserKey(userCleartextPassword); //saves usable key in data attr
        sendDataToServer( sessionStorage.getItem("cryptoKey") );

        if ( $('.notice').text() !== "" ) {
            $('.notice').text("");
        } //clear notice telling user to upload data

    });

}); //end on page load

function sendDataToServer(encryptionKey) {
    console.log(encryptionKey);
    var clearTextJson = sessionStorage.getItem("jsondata");
    var encryptedJson = sjcl.encrypt(encryptionKey, clearTextJson);
    console.log("encrypted version: " + encryptedJson);
    var encodedEncryptedJson = btoa(encryptedJson);
    console.log("encoded version: " + encodedEncryptedJson);


    $.ajax({
        type: "POST",
        url: "/users/save_data",
        data: encodedEncryptedJson,
        success: function() {
            dashboardLoad();
            updateChart();
            calc.loanSnapshot();
        },
        error: handleError
    });

    function handleError(error) {
        console.log("Error");
        console.log(error.responseText);
    }
}
