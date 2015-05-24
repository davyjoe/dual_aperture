
(function() {
  var cancelSubmission, hideNewBlogModal, showNewBlogModal;

  showNewBlogModal = function() {
    return $('#new_blog_modal').modal('show');
  };

  hideNewBlogModal = function() {
    return $('#new_blog_modal').modal('hide');
  };

  cancelSubmission = function(e) {
    $('#new_blog_modal').modal('hide');
    return e.preventDefault();
  };

  $(function() {
    $(document).on('click', '#new_post', showNewBlogModal);
    $(document).on('click', '#new_blog_modal .close_modal', hideNewBlogModal);
    $(document).on('click', '#new_blog_modal .cancel', cancelSubmission);
    return $('a.fancybox').fancybox({
      'maxWidth': 600,
      'maxHeight': 366,
      'autoScale': 'false',
      'autoDimensions': 'false'
    });
  });

}).call(this);
(function() {


}).call(this);
(function() {
  var hideLoginModal, showLoginModal;

  showLoginModal = function() {
    return $('#login_modal').modal('show');
  };

  hideLoginModal = function() {
    return $('#login_modal').modal('hide');
  };

  $(function() {
    $(document).on('click', '#login', showLoginModal);
    return $(document).on('click', '#login_modal .close_modal', hideLoginModal);
  });

}).call(this);
(function() {
  var hideInvisibleContent, hideTeamMemberModal, showInvisibleContent, showTeamMemberModal;

  showInvisibleContent = function(e) {
    var id;
    id = this.id;
    $("#" + id + ".invisible_content").show();
    $("#" + id + ".continue_reading").hide();
    return e.preventDefault();
  };

  hideInvisibleContent = function(e) {
    var id;
    id = this.id;
    $("#" + id + ".invisible_content").hide();
    $("#" + id + ".continue_reading").show();
    return e.preventDefault();
  };

  showTeamMemberModal = function() {
    return $('#portrait_modal').modal('show');
  };

  hideTeamMemberModal = function() {
    return $('#portrait_modal').modal('hide');
  };

  $(function() {
    $(document).on('click', '.continue_reading', showInvisibleContent);
    $(document).on('click', '.collapse', hideInvisibleContent);
    return $(document).on('click', '.member_modal_link', function(e) {
      var id,
        _this = this;
      e.preventDefault();
      id = $(this).data().id;
      showTeamMemberModal();
      return $.getJSON("/team_members/" + id).done(function(data) {
        $('.member_name').text(data.name);
        if (data.nickname) {
          $('.company_title').text(data.nickname);
        } else {
          $('.company_title').text('');
        }
        return $('.modal-body p').text(data.description);
      });
    });
  });

}).call(this);
