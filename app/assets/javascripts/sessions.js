$(function() {

        $("#decryptButton").click(function() {
            var key = $("#userkey").text(this).val();
            console.log("passphrase: "+key);
            var keyBitArray = sjcl.hash.sha256.hash(key); //to make the key
            var halfKeyBitArray = keyBitArray.slice(0, 4); //change from 256bit to 128bit
            var usableKey = sjcl.codec.hex.fromBits(halfKeyBitArray);
            console.log("usable key: "+usableKey);
            $("body").data("cryptoKey", key);
            $("#userkey").val('');

            $.ajax({
                type: "GET",
                url: "/sessions/api",
                async: true,
                success: rawencryptedjson,
                error: handleError
            })

            function rawencryptedjson(response) {
                console.log(response);
                var decoded_json = atob(response);
                console.log(decoded_json);
                $('.rawencryptedjson').append(decoded_json);
                var decrypted = sjcl.decrypt(key, decoded_json);
                console.log(decrypted);
                $("body").data("jsondata", decrypted);
                dashboardLoad();
            };

            function handleError(error) {
                console.log("Error");
                console.log(error.responseText);
            };
        })
    }) //end OnLoad
