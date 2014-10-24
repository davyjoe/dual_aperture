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

showTeamMemberModal = ->
  $('#portrait_modal').modal('show')

hideTeamMemberModal = ->
  $('#portrait_modal').modal('hide')

$ ->
  $(document).on 'click', '.continue_reading', showInvisibleContent
  $(document).on 'click', '.collapse', hideInvisibleContent
  $(document).on 'click', '.member_modal_link', (e) ->
    e.preventDefault()
    id = $(@).data().id
    showTeamMemberModal()

    $.getJSON("/team_members/#{id}").done (data) =>
      $('.member_name').text(data.name)
      $('.company_title').text(data.nickname) if data.nickname
      $('.modal-body p').text(data.description)