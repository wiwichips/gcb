$(document).ready(function() {
    $('#uploadFile').on('change', function(e) {
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

        var form = document.getElementById('uploadFile');
        var name = form.files[0].name;        

        // If the image that was uploaded is not a jpg, reject it
        if (name.split('.')[1] != 'jpg' && name.split('.')[1] != 'jpeg') {
            alert("Error! Cannot process image! Only .jpg and .jpeg images are allowed.");
            return;
        }

        // Change the source of the placeholder image on the site to the image
        // that was just uploaded
        $('#imgToEvaluate').attr("src", 'pic/' + name);



        // Once we have the image uploaded and on the page, we can now run the 
        // classification script
        $.ajax({
            type: 'get',
            url: '/classify',
            data: {filename: name},

            success: (data) => {
                console.log(data);
            }
        });
    });
});
