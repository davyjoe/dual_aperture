# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

# shim layer with setTimeout fallback

showInvisibleContent = (e) ->
  $('.invisible_content').show()
  $('.continue').hide()
  e.preventDefault()

hideInvisibleContent = (e) ->
  $('.invisible_content').hide()
  $('.continue').show()
  e.preventDefault()

$ ->
  $('.invisible_content').hide()
  $(document).on 'click', '.continue', showInvisibleContent
  $(document).on 'click', '.collapse', hideInvisibleContent