$(document).ready(function() {
    $('#uploadFile').on('change', function(e) {
        console.log("detected change");
        // Prepare the data to send
        e.preventDefault();
        var form = document.getElementById('uploadForm');
        var formData = new FormData(form);
        
        /* MISSING HERE: VALIDATION GET REQUEST, REQUIRES AN ENDPOINT TO LIST
           ALL THE FILES BEFORE UPLOADING */

        // Make the request to upload
        $.ajax({
            type: 'post',
            url: '/upload',
            processData: false,
            contentType: false,
            cache: false,
            data: formData,

            success: function() {
                console.log("File uploaded successfully!")
                alert("File uploaded successfully!");
            },

            fail: function(error) {
                console.log("Error! " + error);
                alert("Error! " + error)
            }
        });

        // Reset file chosen button
        var form = document.getElementById('uploadFile');
        form.value = null;
    });
});
