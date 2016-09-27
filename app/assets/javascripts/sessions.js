$(function() {
        $.ajax({
            type: "GET",
            url: "/sessions/api",
            async: true,
            success: rawencryptedjson,
            error: handleError
        })
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
