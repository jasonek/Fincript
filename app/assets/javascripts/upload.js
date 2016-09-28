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
        var key = $("#userkey").text();
        response = $('#uploadPreview').text();
        // console.log(response);
        // var key = "supersecret"
        console.log(key);
        var encrypted_response = sjcl.encrypt(key, response);
        console.log("encrypted version:");
        console.log(encrypted_response);
        // console.log("decrypted version****");
        // var decrypted = sjcl.decrypt(key, encrypted_response);
        // console.log(decrypted);
        // console.log('success');
        console.log("uploaded!");

        $.ajax({
            type: "POST",
            url: "/users/save_data",
            data: encrypted_response,
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
