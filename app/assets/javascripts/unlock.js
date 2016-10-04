$(function() {

        $("#decryptButton").click(function() {
            var userCleartextPassword = $("#userkey").text(this).val();
            $("#userkey").val('');
            generateUserKey(userCleartextPassword); //saves usable key in data attr
        })
    }) //end onLoad

function generateUserKey(clearText) {
    var keyBitArray = sjcl.hash.sha256.hash(clearText); //sha256 makes an 8 item bit array
    var halfKeyBitArray = keyBitArray.slice(0, 4); //change from 256bit to 128bit
    var usableKey = sjcl.codec.hex.fromBits(halfKeyBitArray);
    console.log("clearText: " + clearText);
    console.log("usable key: " + usableKey);
    sessionStorage.setItem("cryptoKey", usableKey);
}
