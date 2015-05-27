
(function(window, $) {

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
            $.post(cform.attr('action'), $('#contactForm').serialize(), function(data){
                console.log(data);
                if (data.success){
                    //alert('Thanks for subscribing!');
                    $("#daSubscribed").modal('show');
                    cform[0].reset();
                }
            }, 'json');

            e.preventDefault();
        });
    }

    function initAndSyncCarousel(){
        var da = $('#carousel-da').carousel(); // "main" carousel; all controls toggle this one
        var ps = $('#carousel-ps').carousel({ interval: false });
        var sa = $('#carousel-sa').carousel({ interval: false });

        da.on('slide.bs.carousel', function (event) {
            // synch toggle with others
            ps.carousel(event.direction === 'right' ? 'prev' : 'next');
            sa.carousel(event.direction === 'right' ? 'prev' : 'next');
        });
    }

    function init(){
        enableAjaxContactForm();
        enableToolButtons();
        initAndSyncCarousel();
    }

    $(init);

    $(window).load(enableNavScrollJump);

})(this, this.jQuery);