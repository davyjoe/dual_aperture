
(function(window, $) {

    $(init);

    function init(){
        enableSubscriberDelete();
        enableSubscriberAdd();
        enableUserDetailModal();
    }

    function enableSubscriberDelete() {
        $(".sDelete").click(function(event){
            var subscriberId = $(this).data('subscriber-id');

            if (!confirm("Are you sure you want to delete '" + $(this).closest('.row').find(".subscriber").text() + "'?")){
                return false;
            }

            $.ajax({
                url: "/subscriber/" + subscriberId, 
                method: "DELETE",
                dataType: "json"
            })
            .done(function(data, textStatus, jqXHR){
                if (data.success){
                    window.location.href = "/manage";
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

    function enableSubscriberAdd(){
        var subscriberAddFormModal = $('#subscriberAddModal');
        subscriberAddFormModal.modal({
            backdrop: "static",
            show: false
        });

        $("#aAdd").click(function(){
            subscriberAddFormModal.find("#subscriber-email").val();
            subscriberAddFormModal.modal('show');
        });

        // form in modal
        var cform = $("#subscriberAddForm");
        cform.submit(function(event){
            event.preventDefault();

            // ensure we have an email
            var emailInputElem = $("#emailInput");
            if (emailInputElem.val() === '' || !emailInputElem.is(":valid")){
                emailInputElem.focus();
                return false;
            }

            $("#btnSubscriberSave").prop("disabled", true);

            // add
            $.post(cform.attr('action'), cform.serialize(), function(data){
                if (data.success){
                    window.location.href = "/manage";
                } else {
                    $("#btnSubscriberSave").prop("disabled", false);
                    alert(data.error);
                    console.log(data.response);
                }
            }, 'json');
        });

        $("#btnSubscriberSave").click(function(){
            cform.submit();
        });
    }

    function enableUserDetailModal(){
        var userDetailFormModal = $('#userDetailModal');
        userDetailFormModal.modal({
            backdrop: "static",
            show: false
        });

        var activeUserId = null;

        $(".user-detail").click(function(){
            activeUserId = $(this).data("user-id");

            // fetch user details
            $.get("user/" + activeUserId)
            .done(function(data, textStatus, jqXHR){
                if (data.success){
                    userDetailFormModal.find("#email").val(data.user.email);
                    userDetailFormModal.find("#username").val(data.user.username);
                    userDetailFormModal.find("#company").val(data.user.company);
                    userDetailFormModal.find("#interests").text(data.user.interests);
                    userDetailFormModal.find("#role").val(data.user.role);
                    userDetailFormModal.find("#createdate").text( Date(data.user.createdate).toString() );
                    userDetailFormModal.modal('show');
                } else {
                    alert(data.error);
                }
            })
            .fail(function(jqXHR, textStatus, errorThrown){
                console.log(textStatus, errorThrown);
            });

        });

        // form in modal
        var uForm = $("#userUpdateForm");
        uForm.submit(function(event){
            event.preventDefault();

            uForm.find("#btnUserSave").prop("disabled", true);

            // update
            $.ajax({
                url: "/user/" + activeUserId,
                method: "PUT",
                data: uForm.serialize(),
                dataType: "json"
            })
            .done(function(data, textStatus, jqXHR){
                if (data.success){
                    window.location.href = "/manage";
                } else {
                    uForm.find("#btnUserSave").prop("disabled", false);
                    alert(data.error);
                    console.log(data.response);
                }
            })
            .fail(function(jqXHR, textStatus, errorThrown){
                uForm.find("#btnUserSave").prop("disabled", false);
                console.log(textStatus, errorThrown);
            });

        });

        $("#btnUserSave").click(function(){
            uForm.submit();
        });

        $("#btnUserDelete").click(function(){
            if (!confirm("Are you sure you want to delete this user?")){
                return false;
            }

            $.ajax({
                url: "/profile/" + activeUserId, 
                method: "DELETE",
                dataType: "json"
            })
            .done(function(data, textStatus, jqXHR){
                if (data.success){
                    window.location.href = "/manage";
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
