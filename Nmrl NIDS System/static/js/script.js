$(document).ready(function () {
    // Image Upload and Prediction Init
    $('.image-section').hide();
    $('.loader').hide();
    $('#result').hide();

    // System Settings Functions
    function applySystemSettings(settings) {
        // Apply theme
        if (settings.ui_theme === 'dark') {
            document.body.classList.add('dark-theme');
            // You might want to add dark theme specific styles for your upload components
            $('.image-upload-container').addClass('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
            $('.image-upload-container').removeClass('dark-theme');
        }
        
        // Apply other settings as needed
    }

    // Check for settings updates periodically
    function checkSystemSettings() {
        fetch('/api/settings/current')
        .then(response => response.json())
        .then(settings => {
            applySystemSettings(settings);
        })
        .catch(error => {
            console.error('Error fetching settings:', error);
        });
    }

    // Initial settings load
    checkSystemSettings();
    
    // Set up periodic checking
    const settingsCheckInterval = setInterval(checkSystemSettings, 30000);  // Check every 30 seconds

    // Upload Preview Functionality
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
                $('#imagePreview').hide();
                $('#imagePreview').fadeIn(650);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#imageUpload").change(function () {
        $('.image-section').show();
        $('#btn-predict').show();
        $('#result').text('');
        $('#result').hide();
        readURL(this);
    });

    // Predict Functionality
    $('#btn-predict').click(function () {
        var form_data = new FormData($('#upload-file')[0]);

        // Show loading animation
        $(this).hide();
        $('.loader').show();

        // Make prediction by calling API /predict
        $.ajax({
            type: 'POST',
            url: '/predict',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            async: true,
            success: function (data) {
                // Get and display the result
                $('.loader').hide();
                $('#result').fadeIn(600);
                $('#result').text(' Result:  ' + data.prediction + ', Confidence: ' + (data.confidence * 100).toFixed(2) + '%');
                console.log('Success!');
            },
            error: function(xhr, status, error) {
                $('.loader').hide();
                $('#btn-predict').show();
                console.error('Prediction error:', error);
            }
        });
    });

    // Clean up interval when needed (optional)
    $(window).on('beforeunload', function() {
        clearInterval(settingsCheckInterval);
    });
});