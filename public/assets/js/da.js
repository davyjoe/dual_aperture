
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

    function init(){
        //enableNavScrollJump();
    }

    $(init);

    $(window).load(enableNavScrollJump);

})(this, this.jQuery);
