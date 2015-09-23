
(function(window, $) {

    $(init);

    function init(){
        enableSignup();
    }

    function enableSignup() {

        var handlers = {
            done: function(data, textStatus, jqXHR){
                if (data.success){
                    alert("User created successfully! Please login.");
                    window.location.href = "/login";
                } else {
                    //console.log(data, textStatus, jqXHR);
                    $("#btnSignupSubmit").prop("disabled", false);
                    $("<div>").addClass("alert alert-danger").html(data.error).insertBefore($("#signupForm"));
                    $('body').scrollTop(0);
                }
            },
            fail: function(jqXHR, textStatus, errorThrown){
                $("#btnSignupSubmit").prop("disabled", false);
                console.log(textStatus, errorThrown);
            }
        };

        // submit form via AJAX
        var bForm = $("#signupForm");
        bForm.submit(function(event){
            event.preventDefault();

            // clear old errors
            $(".alert-danger").remove();

            // validate
            var fields = {
                email: bForm.find("#email").val(),
                username: bForm.find("#username").val(),
                password: bForm.find("#password").val(),
                password2: bForm.find("#password2").val(),
                company: bForm.find("#company").val(),
                interestsOther: bForm.find("#interestsOther").val()
            };

            var errors = [];
            var allowedEmailRE = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i;
            var allowedUsernameRE = /^[a-z0-9]+$/i;
            var allowedMiscRE = /^[\w\s\-,\.()\'\"]*$/;

            if (!fields.email.length){
                errors.push("Missing email.");
            } else if (!allowedEmailRE.test(fields.email)){
                errors.push("Email is invalid.");
            }

            if (!fields.username.length){
                errors.push("Missing username.");
            } else if (!allowedUsernameRE.test(fields.username)) {
                errors.push("Invalid username. Please use alphanumeric characters only.");
            }

            if (!fields.password.length){
                errors.push("Missing password.");
            } else if (fields.password != fields.password2){
                errors.push("Passwords do not match.");
            }

            if (fields.company && !allowedMiscRE.test(fields.company)) {
                errors.push("Invalid company name. Please remove special characters.");
            }

            if (fields.interestsOther && !allowedMiscRE.test(fields.interestsOther)) {
                errors.push("Invalid interest-others value. Please remove special characters.");
            }

            if (!$("#agreement").is(":checked")){
                errors.push("Agreement box not checked.");
            }

            if (errors.length){
                $("<div>").addClass("alert alert-danger").html("Please fix the following issues:<br>- " + errors.join("<br> - ")).insertBefore($("#signupForm"));
                $('body').scrollTop(0);
                return;
            }

            //alert(bForm.serialize());
            //return;

            $("#btnSignupSubmit").prop("disabled", true);

            $.ajax({
                url: "/signup", 
                method: "POST",
                data: bForm.serialize(),
                dataType: "json"
            })
            .done(handlers.done)
            .fail(handlers.fail);
        });

        $("#btnSignupSubmit").click(function(){
            bForm.submit();
        });
    }

})(this, this.jQuery);
