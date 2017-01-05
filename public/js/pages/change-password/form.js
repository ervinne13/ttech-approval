
(function () {

    $(document).ready(function () {
        initializeEvents();
    });

    function initializeEvents() {
        $('#action-update-password').click(function () {
            if (validateOldPassword() && validateSamePassword()) {
                updatePassword();
            }
        });
    }

    function validateOldPassword() {
        var password = $('[name=old_password]').val();

        if (!password || password.length == 0) {
            swal("Error", "Your old password is required", 'error');
            return false;
        }

        return true;
    }

    function validateSamePassword() {

        var password = $('[name=new_password]').val();
        var passwordRepeat = $('[name=new_password_repeat]').val();

        if (!password || password.length == 0) {
            swal("Error", "Your new password is required", 'error');
            return false;
        }

        if (password != passwordRepeat) {
            swal("Error", "Passwords did not match", 'error');
            return false;
        }

        return true;

    }

    function updatePassword() {
        var url = "/change-password";
        var data = {
            password: $('[name=old_password]').val(),
            newPassword: $('[name=new_password]').val(),
            newPasswordRepeat: $('[name=new_password_repeat]').val(),
        };

        $.post(url, data, function (response) {
            console.log(response);

            swal("Success", "Password changed", 'success');
            setTimeout(function () {
                location.href = "/";
            }, 2000);

        }).fail(function (XMLHttpRequest) {
            swal("Error", XMLHttpRequest.responseText, 'error');
        });

    }

})();
