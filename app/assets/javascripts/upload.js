$(function() {

    var fileInput = document.getElementById('uploadFile');
    var dataUploadedByUser;

    fileInput.addEventListener('change', function(e) {
        var file = fileInput.files[0];
        var textType = /text.*/;

        if (file.type.match(textType)) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('#uploadPreview').append(reader.result);
            }
        } else {
            fileDisplayArea.innerText = "File not supported!"
        }
        reader.readAsText(file);
    });

    $("#encryptAndUploadToServer").click(function() {
        // var encryptionKey = $("body").data("cryptoKey");
        var encryptionKey = $('#userkeyEncrypt').val();
        console.log(encryptionKey);
        var response = $('#uploadPreview').text();
        var encrypted_response = sjcl.encrypt(encryptionKey, response);
        console.log("encrypted version: " + encrypted_response);
        var encoded_resp = btoa(encrypted_response);
        console.log("encoded version: " + encoded_resp);

        $.ajax({
            type: "POST",
            url: "/users/save_data",
            data: encoded_resp,
            success: function() {
                console.log('Uploaded successfully.');
            },
            error: handleError
        });
    })

    function handleError(error) {
        console.log("Error");
        console.log(error.responseText);
    };
});
