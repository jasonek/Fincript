$(function() {

        $("#decryptButton").click(function() {
            var key = $("#userkey").text(this).val();
            console.log("key: "+key);
            var keyBitArray = sjcl.hash.sha256.hash(key); //to make the key
            console.log("key bit array: "+ keyBitArray);
            var halfKeyBitArray = keyBitArray.slice(0, 4); //change from 256bit to 128bit
            console.log(halfKeyBitArray);
            var usableKey = sjcl.codec.hex.fromBits(halfKeyBitArray);
            console.log("usable key: "+usableKey);
            $("body").data("cryptoKey", key);
            $("#userkey").val('');

            function getLengthInBytes(str) {
                var b = str.match(/[^\x00-\xff]/g);
                return (str.length + (!b ? 0 : b.length));
            } //checking that splitting SHA256 resulting array in half in fact gives 128bits aka 32 bytes

            var checkingByteSize = getLengthInBytes(usableKey);
            console.log(checkingByteSize);

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
                dashboard();

            };

            function handleError(error) {
                console.log("Error");
                console.log(error.responseText);
            };
        })
    }) //end OnLoad
