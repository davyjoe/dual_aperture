
(function(window, $) {

    $(init);

    function init(){
        enableProfileDelete();
        enableSubscriptionToggles();
    }

    function enableProfileDelete() {
        $(".uDelete").click(function(event){
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
