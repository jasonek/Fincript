$(function() {

        $("#decryptButton").click(function() {
            var key = $("#userkey").text(this).val();
            $("#userkey").val('');
            console.log("passphrase: "+key);
            decryptUserData(key);

            $.ajax({
                type: "GET",
                url: "/sessions/api",
                async: true,
                success: getEncryptedJson,
                error: handleError
            })


            function getEncryptedJson(encodedJson) {
                console.log(encodedJson);
                var decodedJson = atob(encodedJson);
                console.log(decodedJson);
                var clearText = sjcl.decrypt(key, decodedJson);
                console.log(clearText);
                $("body").data("jsondata", clearText);
                dashboardLoad();
                updateChart();
            };

        })

        function decryptUserData(decryptionKey) {
            var keyBitArray = sjcl.hash.sha256.hash(decryptionKey); //to make the key
            var halfKeyBitArray = keyBitArray.slice(0, 4); //change from 256bit to 128bit
            var usableKey = sjcl.codec.hex.fromBits(halfKeyBitArray);
            console.log("usable key: "+ decryptionKey);
            $("body").data("cryptoKey", decryptionKey);
        }

        function handleError(error) {
            console.log("Error");
            console.log(error.responseText);
        };
    }) //end OnLoad
