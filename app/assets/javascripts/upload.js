$(function() {

    var fileInput = document.getElementById('uploadFile');

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
        var encryptionKey = $("body").data("cryptoKey");
        console.log(encryptionKey);

        response = $('#uploadPreview').text();
        // console.log(key);
        var encrypted_response = sjcl.encrypt(encryptionKey, response);
        console.log("encrypted version:");
        console.log(encrypted_response);
        var encoded_resp = btoa(encrypted_response);
        console.log("encoded version:");
        console.log(encoded_resp);

        console.log("uploaded!");



        $.ajax({
            type: "POST",
            url: "/users/save_data",
            data: encoded_resp,
            success: function() {
                console.log('successsssss!');
            },
            error: handleError
        });
    })

    function handleError(error) {
        console.log("Error");
        console.log(error.responseText);
    };
});
