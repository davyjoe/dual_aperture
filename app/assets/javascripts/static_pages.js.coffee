# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

# shim layer with setTimeout fallback

showInvisibleContent = (e) ->
  id = this.id
  $("##{id}.invisible_content").show()
  $("##{id}.continue_reading").hide()
  e.preventDefault()

hideInvisibleContent = (e) ->
  id = this.id
  $("##{id}.invisible_content").hide()
  $("##{id}.continue_reading").show()
  e.preventDefault()

$ ->
  $(document).on 'click', '.continue_reading', showInvisibleContent
  $(document).on 'click', '.collapse', hideInvisibleContent
  $('#CEO_portrait').popover
    title: "David D. Lee"
    placement: "bottom"
    trigger: "hover"
    container: "#tooltip_container"
    content: "David has a long history of taking products from early stage development to finding product-market fit with proven business models. Dual Aperture, in particular, is close to David's heart because the groundbreaking nature of the technology has the potential to change how people will take and think of photographs forever. Prior to founding Dual Aperture, David played an integral role in creating DVI and HDMI standards as founder and CEO of Silicon Image. He received his BS, MS and Ph.D. in EECS from UC Berkeley and currently resides in Palo Alto, CA."