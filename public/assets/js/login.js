
(function(window, $) {

    $(init);

    function init(){
        enableLogin();
    }

    function enableLogin() {

        var handlers = {
            done: function(data, textStatus, jqXHR){
                if (data.success){
                    window.location.href = "/manage";
                } else {
                    //console.log(data, textStatus, jqXHR);
                    $("#btnLoginSubmit").prop("disabled", false);
                    $("<div>").addClass("alert alert-danger").html(data.error).insertBefore($("#loginForm"));
                }
            },
            fail: function(jqXHR, textStatus, errorThrown){
                $("#btnLoginSubmit").prop("disabled", false);
                console.log(textStatus, errorThrown);
            }
        };

        // submit form via AJAX
        var bForm = $("#loginForm");
        bForm.submit(function(event){
            event.preventDefault();

            $("#btnLoginSubmit").prop("disabled", true);

            // clear old errors
            $(".alert-danger").remove();

            $.ajax({
                url: "/login", 
                method: "POST",
                data: bForm.serialize(),
                dataType: "json"
            })
            .done(handlers.done)
            .fail(handlers.fail);
        });

        $("#btnLoginSubmit").click(function(){
            bForm.submit();
        });
    }

})(this, this.jQuery);
