
(function(window, $) {

    $(init);
    $(window).load(enableNavScrollJump);

    function init(){
        enableAjaxContactForm();
        enableToolButtons();

        $("#aLogout").click(function(){
            window.location.href = "/logout";
        });
    }

    function enableNavScrollJump(){

        var nav = $("#mainNav");
        var navHeight = nav.height();
        var jumped = false;
        var threshold = 147;
        var animationDuration = 400;

        $(document).scrollTop(0); // ff
        setTimeout(function(){
            $(document).scrollTop(0); // chrome

            $(document).on('scroll', function(e){
                var scrollTop = this.body.scrollTop + this.documentElement.scrollTop; // chrome, ff
                if (!jumped && scrollTop > threshold){
                    nav.css("top", "-58px").addClass("scrolled");
                    nav.animate({ top: 0 }, animationDuration);
                    jumped = true;
                    return;
                }

                if (jumped && scrollTop <= threshold){
                    nav.animate({ top: "-58px" }, animationDuration/2, function(){
                        nav.css("top", "0").removeClass("scrolled");
                    });
                    jumped = false;
                    return;
                }

                // finish animation if user scrolls too fast
                if (scrollTop < navHeight){
                    nav.finish();
                }
            });
        }, 0);
    }

    function enableToolButtons(){
        var buttonWidth = 52;
        var threshold = 60;
        var opened = false;
        var animationDuration = 400;

        var tools = $(".tools");
        tools.css({
            //right: -1*buttonWidth,
            right: -1*buttonWidth,
            visibility: "visible"
        });
        //setTimeout(function(){
            //tools.animate({"right": -1*buttonWidth}, animationDuration);
        //}, 20);

        $(document).on('scroll', function(e){
            var scrollTop = this.body.scrollTop + this.documentElement.scrollTop; // chrome, ff
            if (!opened && scrollTop > threshold){
                tools.finish().animate({ right: 0 }, animationDuration);
                opened = true;
                return;
            }

            if (opened && scrollTop <= threshold){
                tools.finish().animate({ right: -1*buttonWidth }, animationDuration);
                opened = false;
            }
        });
    }

    function enableAjaxContactForm() {
        var cform = $('#contactForm');

        cform.submit(function(e){
            e.preventDefault();

            $("#btnSubscribe").prop("disabled", true);

            // ensure we have an email
            var emailInputElem = $("#emailInput");
            if (emailInputElem.val() === '' || !emailInputElem.is(":valid")){
                emailInputElem.focus();
                return false;
            }

            // post via AJAX
            $.post(cform.attr('action'), cform.serialize(), function(data){
                if (data.success){
                    $("#btnSubscribe").prop("disabled", false);
                    $("#daSubscribed").modal('show');
                    cform[0].reset();
                } else {
                    alert(data.error);
                    console.log(data.response);
                }
            }, 'json');
        });
    }

})(this, this.jQuery);
