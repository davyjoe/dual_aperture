
(function(window, $) {

    $(init);

    function init(){
        initAndSyncCarousel();
        enableArticleManager();
        enableLogin();
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

    function enableArticleManager() {

        var articleFormModal = $('#articleModal');
        articleFormModal.modal({
            backdrop: "static",
            show: false
        });

        $("#aCreate").click(function(){
            showArticleFormModal(articleFormModal, -1, "", "<p></p>");
            return false;
        });

        $(".aEdit").click(function(event){
            var articleElem = $(this).closest("article");
            showArticleFormModal(articleFormModal, articleElem.data("article-id"), articleElem.find(".aTitle a").html(), articleElem.find(".aBody").html());
            return false;
        });

        var handlers = {
            done: function(data, textStatus, jqXHR){
                if (data.success){
                    window.location.href = window.location.pathname;
                } else {
                    console.log(data, textStatus, jqXHR);
                }
            },
            fail: function(jqXHR, textStatus, errorThrown){
                console.log(textStatus, errorThrown);
            }
        };

        $(".aDelete").click(function(event){
            var articleElem = $(this).closest("article");

            if (!confirm("Are you sure you want to delete '" + articleElem.find(".aTitle").text() + "'?")){
                return false;
            }

            $.ajax({
                url: "/blog/" + articleElem.data("article-id"), 
                method: "DELETE",
                dataType: "json"
            })
            .done(function(data, textStatus, jqXHR){
                // refreshing would result in 404, so go back to main blog page
                if (data.success){
                    window.location.href = "/blog";
                } else {
                    console.log(data, textStatus, jqXHR);
                }
            })
            .fail(handlers.fail);

            return false;
        });

        // form in modal
        var aForm = $("#articleForm");
        aForm.submit(function(event){
            event.preventDefault();

            var aId = articleFormModal.data("articleId");

            if (aId === -1){
                // create
                $.ajax({
                    url: "/blog", 
                    method: "POST",
                    data: aForm.serialize(),
                    dataType: "json"
                })
                .done(handlers.done)
                .fail(handlers.fail);
            } else {
                // edit
                $.ajax({
                    url: "/blog/" + aId,
                    method: "PUT",
                    data: aForm.serialize(),
                    dataType: "json"
                })
                .done(handlers.done)
                .fail(handlers.fail);
            }
        });

        $("#btnArticleSave").click(function(){
            aForm.submit();
        });
    }

    function enableLogin() {

        var loginFormModal = $('#loginModal');
        loginFormModal.modal({
            backdrop: "static",
            show: false
        });

        // login button only shown if url has ?manage
        if (window.location.search.indexOf("manage") > -1){
            loginFormModal.modal("show");
        }

        var handlers = {
            done: function(data, textStatus, jqXHR){
                if (data.success){
                    window.location.reload();
                } else {
                    //console.log(data, textStatus, jqXHR);
                    $("<div>").addClass("alert alert-danger").html(data.error).insertBefore($("#loginForm"));
                }
            },
            fail: function(jqXHR, textStatus, errorThrown){
                console.log(textStatus, errorThrown);
            }
        };

        // form in modal
        var bForm = $("#loginForm");
        bForm.submit(function(event){
            event.preventDefault();

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

        $("#aLogout").click(function(){
            window.location.href = "/logout";
        });
    }

    function showArticleFormModal(modalElem, aId, aTitle, aBody){
        modalElem.data("articleId", aId);
        modalElem.find(".modal-title").html(aId === -1 ? "Create New Article" : "Edit Article " + aId);
        modalElem.find("#article-title").val( aTitle );
        modalElem.find("#article-body").val( aBody );
        modalElem.modal('show');
    }

})(this, this.jQuery);
