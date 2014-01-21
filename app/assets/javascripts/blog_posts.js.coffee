# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

((d, s, id) ->
  js = undefined
  fjs = d.getElementsByTagName(s)[0]
  return  if d.getElementById(id)
  js = d.createElement(s)
  js.id = id
  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1"
  fjs.parentNode.insertBefore js, fjs
) document, "script", "facebook-jssdk"

showNewBlogModal = ->
  $('#new_blog_modal').modal('show')

hideNewBlogModal = ->
  $('#new_blog_modal').modal('hide')

cancelSubmission = (e) ->
  $('#new_blog_modal').modal('hide')
  e.preventDefault()

$ ->
  $(document).on 'click', '#new_post', showNewBlogModal
  $(document).on 'click', '#new_blog_modal .close_modal', hideNewBlogModal
  $(document).on 'click', '#new_blog_modal .cancel', cancelSubmission