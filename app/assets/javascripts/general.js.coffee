showLoginModal = ->
  $('#login_modal').modal('show')

hideLoginModal = ->
  $('#login_modal').modal('hide')

$ ->
  $(document).on 'click', '#login', showLoginModal
  $(document).on 'click', '#login_modal .close_modal', hideLoginModal