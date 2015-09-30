
(function(window, $) {

    $(init);

    function init(){
        enableChangePassword();
        enableProfileDelete();
        enableSubscriptionToggles();
    }

    function enableChangePassword(){
        var changePwModal = $('#changePwModal');
        changePwModal.modal({
            backdrop: "static",
            show: false
        });

        // form in modal
        var cpForm = $("#changePwForm");
        cpForm.submit(function(event){
            event.preventDefault();

            // clear old errors
            $(".alert-danger").remove();

            var fields = {
                newPassword: cpForm.find("#newPassword").val(),
                password2: cpForm.find("#password2").val()
            };

            var error = "";

            // validate
            if (!fields.newPassword.length){
                error = "Please enter a password.";
            } else if (fields.newPassword != fields.password2){
                error = "Passwords do not match.";
            }

            if (error.length){
                $("<div>").addClass("alert alert-danger").html(error).insertBefore(cpForm);
                return;
            }


            $("#btnSubmit").prop("disabled", true);

            // update
            $.ajax({
                url: "/passwordUpdate",
                method: "PUT",
                data: cpForm.serialize(),
                dataType: "json"
            })
            .done(function(data, textStatus, jqXHR){
                if (data.success){
                    alert("Password changed successfully.");
                    window.location.href = "/profile";
                } else {
                    cpForm.find("#btnSubmit").prop("disabled", false);
                    alert(data.error);
                    console.log(data.response);
                }
            })
            .fail(function(jqXHR, textStatus, errorThrown){
                cpForm.find("#btnSubmit").prop("disabled", false);
                console.log(textStatus, errorThrown);
            });

        });

        $("#btnSubmit").click(function(event){
            cpForm.submit();
        });

        $("#changePw").click(function(event){
            event.preventDefault();
            changePwModal.modal('show');
        });
    }

    function enableProfileDelete() {
        $("#uDelete").click(function(event){
            if (!confirm("Warning! You are about to delete your profile. Are you sure?")) {
                return;
            }

            var userId = $(this).data('userid');

            $.ajax({
                url: "/profile/" + userId, 
                method: "DELETE",
                dataType: "json"
            })
            .done(function(data, textStatus, jqXHR){
                // refreshing would result in 404, so go back to main blog page
                if (data.success){
                    alert("Your profile has been deleted.");
                    window.location.href = "/";
                } else {
                    console.log(data, textStatus, jqXHR);
                }
            })
            .fail(function(jqXHR, textStatus, errorThrown){
                console.log(textStatus, errorThrown);
            });

            return false;
        });

    }

    function enableSubscriptionToggles(){
        $('#subGeneral').click(function(){

            var params = { 
                email: $(this).data('email'), 
                sendConf: true 
            };

            $.post("subscribe", params, function(data){
                if (data.success){
                    window.location.href = "/profile";
                } else {
                    alert(data.error);
                    console.log(data.response);
                }
            }, 'json');
        });

        $('#unsubGeneral').click(function(){

            var subscriberId = $(this).data('subscriber-id');

            if (!confirm("Are you sure you want to unsubscribe from our general email list?")){
                return false;
            }

            $.ajax({
                url: "/subscriber/" + subscriberId, 
                method: "DELETE",
                dataType: "json"
            })
            .done(function(data, textStatus, jqXHR){
                if (data.success){
                    window.location.href = "/profile";
                } else {
                    console.log(data, textStatus, jqXHR);
                }
            })
            .fail(function(jqXHR, textStatus, errorThrown){
                console.log(textStatus, errorThrown);
            });

            return false;
        });

    }

})(this, this.jQuery);
