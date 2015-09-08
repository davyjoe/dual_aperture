
(function(window, $) {

    $(init);

    function init(){
        enableSubscriberDelete();
        enableSubscriberAdd();
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

})(this, this.jQuery);
