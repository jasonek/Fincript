$(function() {
    $.ajax({
        type: "GET",
        url: "/sessions/api",
        async: true,
        success: rawencryptedjson,
        error: handleError
    })

function rawencryptedjson(response) {
    $('.rawencryptedjson').append(response)
    console.log(response);
    console.log('success');
};

function handleError(error) {
    console.log("Error");
    console.log(error.responseText);
};




var Cipher = __import(this, "Cipher");

function stringBreak(s, col) {
    var result = "";
    for (var i = 0; i < s.length; i++) {
        result += s.charAt(i);
        if (((i + 1) % col == 0) && (0 < i)) {
            result += "\n";
        }
    }
    return result;
}

function pack(s) {
    var result = "";
    for (var i = 0; i < s.length; i++) {
        var c = s.charAt(i);
        if (c == " " || c == "\t" || c == "\r" || c == "\n") {} else {
            result += c;
        }
    }
    return result;
}

function createCipher(directionName) {
    var algorithm = Cipher["Twofish"];
    var mode = Cipher["CBC"];
    var padding = Cipher["PKCS7"];
    var direction = Cipher[directionName];
    var cipher = Cipher.create(algorithm, direction, mode, padding);
    return cipher;
}

function encrypt() {
    var cipher = createCipher("ENCRYPT");
    var text = str2utf8(document.form1.input.value); //CHANGE TO RAW ENC JSON
    var key = base64_decode(pack(document.form1.key64.value)); //CHANGE TO USERS KEY
    text = cipher.execute(key.concat(), text.concat());
    var result = stringBreak(base64_encode(text), 48);
    document.form1.output.value = result;

}

function decrypt() {
    var cipher = createCipher("DECRYPT");
    var text = base64_decode(pack(document.form1.input.value));
    var key = base64_decode(pack(document.form1.key64.value));
    text = cipher.execute(key.concat(), text.concat());
    var result = utf82str(text);
    document.form1.output.value = result;
}

})
