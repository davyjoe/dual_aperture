# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

showNewBlogModal = ->
  $('#new_blog_modal').modal('show')

hideNewBlogModal = ->
  $('#new_blog_modal').modal('hide')

$ ->
  $(document).on 'click', '#new_post', showNewBlogModal
  $(document).on 'click', '#new_blog_modal .close_modal', hideNewBlogModal