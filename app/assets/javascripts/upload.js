$(function() {

            var fileInput = document.getElementById('uploadFile');

            fileInput.addEventListener('change', function(e) {
                var file = fileInput.files[0];
                var textType = /text.*/;

                if (file.type.match(textType)) {

                    var reader = new FileReader();
                    reader.onload = function(e) {
                        $('#uploadPreview').append(reader.result);
                        // document.form1.input.value = reader.result;
                    }
                } else {
                    fileDisplayArea.innerText = "File not supported!"
                }
                reader.readAsText(file);
            });

    });
